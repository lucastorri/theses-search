require 'rubygems'
require 'bundler'
require 'open-uri'
Bundler.require :default

service = 'http://127.0.0.1:8123'
data_dir = ENV['DATA_DIR']

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
  read "#{service}/search/#{params[:query]}"
end

get '/snippets' do
  content_type :json
  read "#{service}/snippets/#{params[:id]}/#{params[:query]}"
end

get '/hl' do
  content_type :json
  read "#{service}/hl/#{params[:file]}/#{params[:query]}"
end

get '/download/:file' do
  send_file File.join(data_dir, params[:file])
end

def metadata m
  <<-EOS.gsub(/^ */, '').strip
    title=#{m[:title]}
    author=#{m[:author]}
    date=#{m[:date]}
  EOS
end

post '/upload' do
  thesis = params[:doc]
  unless thesis.nil?
    file = data_dir + '/' + thesis[:filename]
    File.open(file, "w") { |f| f.write(thesis[:tempfile].read) } # move instead of read/write ?
    File.open(file + '.metadata', "w") { |f| f.write(metadata(params)) }
  end
	return
end