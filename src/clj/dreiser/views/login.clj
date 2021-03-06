(ns dreiser.views.login
  (:use [hiccup.core :only (html)]
        [hiccup.page :only (html5 include-css include-js)])
  (:require [clojure.string :as string]
            [dreiser.views.common :as cv]))




(defn fixed-nav []
  [:nav.navbar.navbar-inverse
    [:div.navbar-header
     [:a.navbar-brand {:href "/"} "Dreiser"]]
    [:div.navbar-collapse.collapse.navbar-inverse-collapse
      [:ul.nav.navbar-nav.navbar-right
        [:li
         [:a {:href "mailto:dreiser@helpful.io" :data-helpful "dreiser"} "Contact us"]]
        [:li
         [:a {:href "/login"} "Login"]]]]])


(defn index []
  (html5 {:lang "en"}
    [:head
      [:meta {:charset "UTF-8"}]
      [:meta {:http-equiv "X-UA-Compatible" :content "IE=edge,chrome=1"}]
      [:meta {:name "viewport" :content "width=device-width, initial-scale=1.0, user-scalable=no"}]
      [:link {:href "/favicon.png" :rel "shortcut icon"}]
      [:link {:href "/humans.txt" :rel "author"}]
     (include-css "/css/app.css")
     (include-js "/js/vendor.js")
     (include-css "http://fonts.googleapis.com/css?family=Playfair+Display:700,700italic")
     (include-css "http://fonts.googleapis.com/css?family=Open+Sans:400italic,400,700,300")
     (cv/ga)
     ]
    [:body
     (fixed-nav)
     [:section.pricing-block.white-block.container
       [:div.row
        [:div.col-xs-12.col-md-8.col-md-offset-2
         [:h3 "Please login with your Shopify account"]
         [:p "Enter url of you Shopify shop and press Log In"]
         (cv/login-form)]]]]))

