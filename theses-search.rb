require 'rubygems'
require 'bundler'
require 'open-uri'
Bundler.require :default

service = 'http://10.27.15.13:8123/'
service_search = service + 'search/%s'

get '/' do
  erb :index
end

get '/search' do
  content_type :json
  URI.parse(service_search % params[:query].gsub(' ', '+')).read
end