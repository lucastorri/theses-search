require 'rubygems'
require 'bundler'
require 'open-uri'
Bundler.require :default

service = 'http://127.0.0.1:8123'

def read uri
  URI.parse(URI.encode(uri)).read
end

get '/' do
  erb :index, :locals => { :puc => false }
end

get '/puc' do
  erb :index, :locals => { :puc => true }
end

get '/search' do
  content_type :json
  read "#{service}/snippets/#{params[:query]}"
end

get '/hl' do
  content_type :json
  read "#{service}/hl/#{params[:file]}/#{params[:query]}"
end