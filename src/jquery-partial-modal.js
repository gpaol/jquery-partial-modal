/*!
 * jQuery plugin to load Bootstrap modals with ASP.NET Core partial views v1.0
 * 
 * Authors: Paolo Gaetano
 * Copyright (c) 2026 Paolo Gaetano
 * Released under the MIT license
 */
(function ($) {
    /**
     * jQuery plugin to load Bootstrap modals with ASP.NET Core partial views
     * Supports two modes:
     * 1. Direct call: $(element).loadPartialModal({ url: '...', ... })
     * 2. Declarative: $(selector).loadPartialModal() with data attributes on elements
     * 
     * Data attributes supported:
     * - data-modal-url: URL to load (required)
     * - data-modal-method: HTTP method (default: POST)
     * - data-modal-title: Modal title (default: 'Modal')
     * - data-modal-size: Bootstrap size class (modal-sm, modal-lg, modal-xl)
     * - data-modal-data: JSON string with data to send
     * - data-modal-submit-url: URL for form submission (if different from load URL)
     * - data-modal-on-loaded: Name of global callback function to call after load
     * - data-modal-on-success: Name of global callback function to call on successful form submission
     * - data-modal-on-error: Name of global callback function to call on error (load or submit)
     * 
     * Events triggered:
     * - beforeLoad.partialModal: Before modal starts loading (cancelable)
     * - loaded.partialModal: After partial content is loaded into modal
     * - success.partialModal: After successful form submission (after modal is hidden)
     * - error.partialModal: On error (load or submit)
     * 
     * @example
     * // Programmatic mode - simple view
     * $('#myButton').on('click', function() {
     *     $(this).loadPartialModal({
     *         url: '/Home/UserDetails',
     *         method: 'POST',
     *         data: { id: 123 },
     *         title: 'User Profile',
     *         size: 'modal-lg',
     *         onLoaded: function(modal) {
     *             console.log('Modal loaded');
     *         }
     *     });
     * });
     * 
     * @example
     * // Programmatic mode - form with submission
     * $('#createBtn').on('click', function() {
     *     $(this).loadPartialModal({
     *         url: '/Home/CreateProductForm',
     *         method: 'GET',
     *         title: 'Create Product',
     *         size: 'modal-md',
     *         onSubmit: function(formData, callback) {
     *             $.ajax({
     *                 url: '/Home/CreateProduct',
     *                 method: 'POST',
     *                 data: formData,
     *                 processData: false,
     *                 contentType: false,
     *                 dataType: 'json',
     *                 success: function(result) {
     *                     callback(result);
     *                     if (result.success) {
     *                         $('#partialModal').one('hidden.bs.modal', function() {
     *                             alert(result.message);
     *                         });
     *                     }
     *                 },
     *                 error: function(xhr) {
     *                     if (xhr.status === 200 && xhr.responseText) {
     *                         callback({ success: false, html: xhr.responseText });
     *                     } else {
     *                         callback({ success: false, message: "Error occurred" });
     *                     }
     *                 }
     *             });
     *         }
     *     });
     * });
     * 
     * @example
     * // Declarative mode - HTML with data attributes
     * // HTML:
     * // <button class="modal-trigger" 
     * //         data-modal-url="/Home/UserDetails"
     * //         data-modal-method="POST"
     * //         data-modal-title="User Profile"
     * //         data-modal-size="modal-lg"
     * //         data-modal-data='{"id": 123}'>
     * //     Show User
     * // </button>
     * 
     * // JavaScript:
     * $('.modal-trigger').loadPartialModal();
     * 
     * @example
     * // Declarative mode - with global callbacks
     * // HTML:
     * // <button class="modal-trigger" 
     * //         data-modal-url="/Home/CreateProductForm"
     * //         data-modal-submit-url="/Home/CreateProduct"
     * //         data-modal-on-loaded="onFormLoaded"
     * //         data-modal-on-success="onProductCreated"
     * //         data-modal-on-error="onProductError">
     * //     Create Product
     * // </button>
     * 
     * // JavaScript:
     * function onFormLoaded(modal) {
     *     console.log('Form loaded');
     * }
     * 
     * function onProductCreated(result) {
     *     alert('Product created: ' + result.message);
     * }
     * 
     * function onProductError(errorData) {
     *     alert('Error: ' + errorData.message);
     * }
     * 
     * $('.modal-trigger').loadPartialModal();
     * 
     * @example
     * // Declarative mode - with jQuery events
     * // HTML:
     * // <button id="myBtn" class="modal-trigger" 
     * //         data-modal-url="/Home/CreateProductForm"
     * //         data-modal-submit-url="/Home/CreateProduct">
     * //     Create Product
     * // </button>
     * 
     * // JavaScript:
     * $('#myBtn')
     *     .data('hasSuccessHandler', true)  // Prevent default alert
     *     .on('loaded.partialModal', function(event, modal) {
     *         console.log('Form loaded');
     *     })
     *     .on('success.partialModal', function(event, result) {
     *         alert('Success: ' + result.message);
     *     })
     *     .on('error.partialModal', function(event, errorData) {
     *         alert('Error: ' + errorData.message);
     *     });
     * 
     * $('.modal-trigger').loadPartialModal();
     * 
     * @param {Object} options - Configuration for the modal
     * @returns {jQuery} - Maintains chainability
     */
    $.fn.loadPartialModal = function (options) {
        // If called on multiple elements or with no options, set up click handlers
        if (this.length > 1 || (this.length === 1 && !options)) {
            return this.each(function () {
                const $element = $(this);
                
                // Remove any existing handler to avoid duplicates
                $element.off('click.partialModal');
                
                // Attach click handler
                $element.on('click.partialModal', function (e) {
                    e.preventDefault();
                    
                    // Read configuration from data attributes
                    const dataOptions = {
                        url: $element.data('modal-url') || $element.attr('href') || '',
                        method: $element.data('modal-method') || 'POST',
                        title: $element.data('modal-title') || 'Modal',
                        size: $element.data('modal-size') || '',
                        data: $element.data('modal-data') || {},
                        loadingText: $element.data('modal-loading-text') || 'Loading...',
                        errorText: $element.data('modal-error-text') || 'Failed to load content. Please try again.',
                        triggerElement: $element  // Store reference to trigger element
                    };
                    
                    // Parse data if it's a JSON string
                    if (typeof dataOptions.data === 'string') {
                        try {
                            dataOptions.data = JSON.parse(dataOptions.data);
                        } catch (e) {
                            console.warn('Invalid JSON in data-modal-data attribute');
                            dataOptions.data = {};
                        }
                    }
                    
                    // Handle onLoaded callback (supports both global function name and direct event)
                    const onLoadedFnName = $element.data('modal-on-loaded');
                    if (onLoadedFnName && typeof window[onLoadedFnName] === 'function') {
                        dataOptions.onLoaded = window[onLoadedFnName];
                    } else {
                        // Use custom event as fallback
                        dataOptions.onLoaded = function(modal) {
                            $element.trigger('loaded.partialModal', [modal]);
                        };
                    }
                    
                    // Handle onSuccess callback
                    const onSuccessFnName = $element.data('modal-on-success');
                    const onSuccessFn = onSuccessFnName && typeof window[onSuccessFnName] === 'function' 
                        ? window[onSuccessFnName] 
                        : null;
                    
                    // Handle onError callback
                    const onErrorFnName = $element.data('modal-on-error');
                    const onErrorFn = onErrorFnName && typeof window[onErrorFnName] === 'function' 
                        ? window[onErrorFnName] 
                        : null;
                    
                    // Add onError to dataOptions if exists
                    if (onErrorFn) {
                        dataOptions.onError = onErrorFn;
                    }
                    
                    // Check for submit URL
                    const submitUrl = $element.data('modal-submit-url');
                    if (submitUrl) {
                        dataOptions.onSubmit = function (formData, callback) {
                            $.ajax({
                                url: submitUrl,
                                method: 'POST',
                                data: formData,
                                processData: false,
                                contentType: false,
                                dataType: 'json',
                                success: function (result) {
                                    callback(result);
                                    if (result.success) {
                                        // Check if custom handler is set (either global function or marked with data attribute)
                                        const hasCustomHandler = onSuccessFn || $element.data('hasSuccessHandler');
                                        
                                        // Wait for modal to hide before triggering callbacks
                                        $('#partialModal').one('hidden.bs.modal', function () {
                                            // Trigger success callback/event after modal is hidden
                                            if (onSuccessFn) {
                                                onSuccessFn(result);
                                            }
                                            
                                            $element.trigger('success.partialModal', [result]);
                                            
                                            // Show default alert only if no custom handlers
                                            if (result.message && !hasCustomHandler) {
                                                alert(result.message);
                                            }
                                        });
                                    }
                                },
                                error: function (xhr) {
                                    if (xhr.status === 200 && xhr.responseText) {
                                        // Validation errors
                                        callback({ success: false, html: xhr.responseText });
                                    } else {
                                        // Actual error
                                        const errorData = { success: false, message: "Submission failed", xhr: xhr };
                                        callback(errorData);
                                        
                                        // Trigger error callbacks/events
                                        if (onErrorFn) {
                                            onErrorFn(errorData);
                                        }
                                        $element.trigger('error.partialModal', [errorData]);
                                    }
                                }
                            });
                        };
                    }
                    
                    // Trigger custom event before loading
                    const beforeLoadEvent = $.Event('beforeLoad.partialModal', { settings: dataOptions });
                    $element.trigger(beforeLoadEvent);
                    
                    if (!beforeLoadEvent.isDefaultPrevented()) {
                        // Call the actual modal loader
                        loadModal(dataOptions);
                    }
                });
            });
        }
        
        // Direct call mode with options
        return loadModal(options || {});
    };
    
    /**
     * Internal function to load and show the modal
     */
    function loadModal(options) {
        // Default configuration
        const defaults = {
            url: '',               // Action URL returning the partial view
            data: {},              // Model/data to pass to the action
            method: 'POST',        // HTTP method (GET/POST)
            title: 'Modal',        // Modal header title
            size: '',              // Bootstrap size class (e.g., 'modal-lg', 'modal-xl')
            loadingText: 'Loading...',
            errorText: 'Failed to load content. Please try again.',
            onLoaded: function () {},  // Callback after partial loads
            onSubmit: null,           // Callback for form submission (optional)
            onSuccess: null,          // Callback after successful form submission
            onError: null,            // Callback on error (load or submit)
            triggerElement: null      // Element that triggered the modal (for events)
        };

        // Merge user options with defaults
        const settings = $.extend({}, defaults, options);

        // Get or create modal element (single instance in DOM)
        let modal = $('#partialModal');
        if (modal.length === 0) {
            modal = $(`
                <div class="modal fade" id="partialModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="text-center py-4">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">${settings.loadingText}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer"></div>
                        </div>
                    </div>
                </div>
            `).appendTo('body');
        }

        // Configure modal size
        const modalDialog = modal.find('.modal-dialog');
        modalDialog.removeClass('modal-sm modal-lg modal-xl');
        if (settings.size) modalDialog.addClass(settings.size);

        // Set title and reset content
        modal.find('.modal-title').text(settings.title);
        const modalBody = modal.find('.modal-body');
        const modalFooter = modal.find('.modal-footer');
        modalBody.html(`
            <div class="text-center py-4">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">${settings.loadingText}</span>
                </div>
            </div>
        `);
        modalFooter.empty();

        // Remove any existing Bootstrap modal instance and event handlers
        const existingInstance = bootstrap.Modal.getInstance(modal[0]);
        if (existingInstance) {
            existingInstance.dispose();
        }
        
        // Remove previous event handlers using namespace
        modal.off('hidden.bs.modal.partialModal');

        // Create new Bootstrap modal instance
        const bootstrapModal = new bootstrap.Modal(modal[0]);

        // Load partial view via AJAX
        $.ajax({
            url: settings.url,
            method: settings.method,
            data: settings.data,
            dataType: 'html',
            success: function (partialHtml) {
                // Insert partial content into modal body
                modalBody.html(partialHtml);

                // Move partial-defined footer content to modal footer (if exists)
                const partialFooter = modalBody.find('.modal-footer-content');
                if (partialFooter.length) {
                    modalFooter.html(partialFooter.html());
                    partialFooter.remove();
                }

                // Trigger post-load callback
                settings.onLoaded(modal);

                // Enable jQuery validation if available
                if ($.validator && $.validator.unobtrusive) {
                    $.validator.unobtrusive.parse(modalBody.find('form'));
                }

                // Handle form submission if callback is provided
                if (typeof settings.onSubmit === 'function') {
                    const form = modalBody.find('form');
                    
                    // Remove any existing form submit handlers first
                    form.off('submit.partialModal');
                    
                    // Function to handle form submission
                    const handleSubmit = function (e) {
                        e.preventDefault();
                        // Always get the current form from modalBody to handle reloaded forms
                        const currentForm = modalBody.find('form');
                        const formData = new FormData(currentForm[0]);
                        
                        // Pass form data to user-defined submit handler
                        settings.onSubmit(formData, function (result) {
                            if (result.success) {
                                bootstrapModal.hide();
                            } else if (result.html) {
                                // Refresh form with validation errors
                                modalBody.html(result.html);
                                
                                // Re-enable jQuery validation
                                if ($.validator && $.validator.unobtrusive) {
                                    $.validator.unobtrusive.parse(modalBody.find('form'));
                                }
                                
                                // Re-attach handlers after refreshing content
                                const newForm = modalBody.find('form');
                                newForm.off('submit.partialModal').on('submit.partialModal', handleSubmit);
                                
                                // Re-attach submit button handlers
                                const newPartialFooter = modalBody.find('.modal-footer-content');
                                if (newPartialFooter.length) {
                                    modalFooter.html(newPartialFooter.html());
                                    newPartialFooter.remove();
                                    modalFooter.find('button[type="submit"]').off('click.partialModal').on('click.partialModal', function (e) {
                                        e.preventDefault();
                                        newForm.trigger('submit.partialModal');
                                    });
                                }
                            }
                        });
                    };
                    
                    // Add form submit handler
                    form.on('submit.partialModal', handleSubmit);
                    
                    // Add click handler to submit buttons in footer (since they're outside the form now)
                    modalFooter.find('button[type="submit"]').off('click.partialModal').on('click.partialModal', function (e) {
                        e.preventDefault();
                        form.trigger('submit.partialModal');
                    });
                }
            },
            error: function (xhr, status, error) {
                modalBody.html(`<div class="alert alert-danger" role="alert">${settings.errorText}</div>`);
                
                // Trigger error callback/event if available
                const errorData = { xhr: xhr, status: status, error: error, message: settings.errorText };
                
                if (settings.onError && typeof settings.onError === 'function') {
                    settings.onError(errorData);
                }
                
                if (settings.triggerElement) {
                    settings.triggerElement.trigger('error.partialModal', [errorData]);
                }
            }
        });

        // Show modal
        bootstrapModal.show();

        // Cleanup on modal close (using namespace to avoid conflicts)
        modal.on('hidden.bs.modal.partialModal', function () {
            // Remove form event handlers before clearing content
            modalBody.find('form').off('submit.partialModal');
            modalFooter.find('button[type="submit"]').off('click.partialModal');
            modalBody.empty();
            modalFooter.empty();
            // Dispose the current Bootstrap modal instance
            if (bootstrapModal && typeof bootstrapModal.dispose === 'function') {
                bootstrapModal.dispose();
            }
        });

        return $();
    }
})(jQuery);