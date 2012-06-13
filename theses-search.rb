require 'rubygems'
require 'bundler'
require 'open-uri'
Bundler.require :default

service = 'http://10.27.15.13:8123'

def encode query
  URI.encode(query.gsub(' ', '+'))
end

get '/' do
  erb :index
end

get '/search' do
  content_type :json
  uri = "#{service}/search/#{encode(params[:query])}"
  URI.parse(uri).read
end

get '/hl' do
  content_type :json
  uri = "#{service}/hl/#{params[:file]}/#{encode(params[:query])}"
  URI.parse(uri).read
end