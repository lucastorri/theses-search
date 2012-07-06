require 'rubygems'
require 'bundler'
require 'open-uri'
require 'date'
Bundler.require :default

service = 'http://127.0.0.1:8123'
data_dir = ENV['DATA_DIR']

def read uri
  URI.parse(URI.encode(uri).gsub('[', '%5B').gsub(']', '%5D')).read
end

get '/' do
  erb :index, :locals => { :puc => false }
end

get '/puc' do
  erb :index, :locals => { :puc => true }
end

def query p
  title = "title:(#{p[:title]}) " if not p[:title].to_s.strip.empty?
  author = "author:(#{p[:author]}) " if not p[:author].to_s.strip.empty?
  date = 
    "date:[" + 
    "#{(p[:startdate].to_s.strip.empty?) ? '*' : parse_date(p[:startdate])} TO " + 
    "#{(p[:enddate].to_s.strip.empty?) ? '*' : parse_date(p[:enddate])}]".strip if 
    (not p[:startdate].to_s.strip.empty?) or (not p[:enddate].to_s.strip.empty?)
  "#{p[:q]} #{title}#{author}#{date}".strip
end

get '/search' do
  content_type :json
  read "#{service}/search/#{query(params)}"
end

get '/snippets' do
  content_type :json
  read "#{service}/snippets/#{params[:id]}/#{params[:q]}"
end

get '/hl' do
  content_type :json
  read "#{service}/hl/#{params[:file]}/#{params[:q]}"
end

get '/download/:file' do
  send_file File.join(data_dir, params[:file])
end

def metadata m
  <<-EOS.gsub(/^ */, '').strip
    title=#{m[:title]}
    author=#{m[:author]}
    date=#{parse_date(m[:date])}
  EOS
end

def parse_date d
  Date.strptime(d, '%d-%m-%Y').to_time.to_i.to_s.rjust(20, '0')
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