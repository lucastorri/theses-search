require 'rubygems'
require 'bundler'
require 'open-uri'
Bundler.require :default

#configure do
#  set :public_folder, File.dirname(__FILE__)+'/../public'
#end

service = 'http://localhost:8123/'
service_search = service + 'search/%s'

get '/' do
  puts '### INDEX'
  erb :index
end

get '/search' do
  puts '### QUERY'
  #result = URI.parse(service_search % params[:query]).read
  result = params[:query]
  erb :results, :locals => {
    :result => result
  }
end