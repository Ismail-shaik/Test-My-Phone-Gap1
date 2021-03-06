/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 9/7/12
 * Time: 3:50 PM
 */

define(['jquery', 'underscore', 'Backbone', 'Backbone.Force', 'forcetk.ui', './LoginConfigView', './MainView',
        'text!./LoginView.tpl'],
    function ($, _, Backbone, Force, forcetk, LoginConfigView, MainView, LoginTemplate) {

        var LoginView = Backbone.View.extend({

            events:{
                'pageshow':'this_pageshowHandler',
                'click #btnLogin':'btnLogin_clickHandler',
                'click #btnLoginConfig':'btnLoginConfig_clickHandler'
            },

            render:function () {
                this.$el.html(LoginTemplate);
                return this;
            },

            firstShow:true,

            this_pageshowHandler:function (event) {
                if (this.firstShow) {
                    if (localStorage.getItem('ftkui_refresh_token'))
                        this.login();

                    this.firstShow = false;
                }
            },

            btnLogin_clickHandler:function () {
                this.login();
            },

            login:function () {

                $.mobile.showPageLoadingMsg(null, 'Authenticating...');

                var loginConfig = localStorage.getItem('gf_login_config'),
                // Salesforce login URL
                    loginURL = loginConfig ? loginConfig.loginURL : 'https://login.salesforce.com/',
                // Salesforce consumer key
                    consumerKey = loginConfig ? loginConfig.consumerKey : '3MVG9xOCXq4ID1uF8OMzgOM15zt0ZwsPpN8ClmJVR0wMv0i0FF8f9enlGTZuFjuGalN6towZ35o7K24UVlb2R',
                // Salesforce callback URL
                    callbackURL = loginConfig ? loginConfig.callbackURL : 'https://login.salesforce.com/services/oauth2/success',
                // Instantiating forcetk ClientUI
                    ftkClientUI = new forcetk.ClientUI(loginURL, consumerKey, callbackURL,
                        function forceOAuthUI_successHandler(forcetkClient) { // successCallback
                            // Initializing Backbone.Force plugin
                            Force.initialize(forcetkClient);

                            $.mobile.jqmNavigator.pushView(new MainView({ftkClientUI:ftkClientUI}));
                        },

                        function forceOAuthUI_errorHandler(error) { // errorCallback
                            navigator.notification.alert('Login failed: ' + error.message, null, 'Error');
                        });

                // Initiating login process
                ftkClientUI.login();

            },

            btnLoginConfig_clickHandler:function () {
                $.mobile.jqmNavigator.pushView(new LoginConfigView());
            }

        });

        return LoginView;
    });