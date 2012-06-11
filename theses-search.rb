require 'rubygems'
require 'bundler'
require 'open-uri'

Bundler.require :default

service = 'http://localhost:8123/'
service_search = service + 'search/%s'

get '/' do
  erb :index
end

get '/:query' do
  result = URI.parse(service_search % params[:query]).read
  erb :results, :locals => {
    :result => result
  }
end