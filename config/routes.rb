Rails.application.routes.draw do

  root :to => 'home#index'

  get 'allgames/index'
  get 'highlowdice/index'
  
end
