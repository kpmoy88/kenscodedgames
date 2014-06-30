Rails.application.routes.draw do

  root 'home#index'

  get 'allgames/index'
  get 'highlowdice/index'
  
end
