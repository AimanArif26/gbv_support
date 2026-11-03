Rails.application.routes.draw do
  root 'pages#home'

  get    '/what-is',          to: 'pages#what_is',          as: :what_is
  get    '/contact',          to: 'pages#contact',          as: :contact
  post   '/contact',          to: 'pages#send_message'
  get    '/law-enforcement',  to: 'pages#law_enforcement',  as: :law_enforcement
  get    '/enforcer',         to: 'pages#enforcer',         as: :enforcer
  get    '/hotline',          to: 'pages#hotline',          as: :hotline

  get    '/login',            to: 'sessions#new',           as: :login
  post   '/login',            to: 'sessions#create'
  delete '/logout',           to: 'sessions#destroy',       as: :logout

  get    '/admin',            to: 'pages#admin',            as: :admin
end
