require 'rubygems'
require 'bundler'
require 'open-uri'
Bundler.require :default

service = 'http://127.0.0.1:8123'
data_dir = ENV['DATA_DIR']

def encode query
  URI.encode(query.gsub(' ', '+'))
end

get '/' do
  erb :index, :locals => { :puc => false }
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

get '/puc' do
  erb :index, :locals => { :puc => true }
end

post '/upload' do
  thesis = params[:thesis]
  unless thesis.nil?
    File.open(data_dir + '/' + thesis[:filename], "w") do |f|
      f.write(thesis[:tempfile].read)
    end
  end
	redirect '/'
end