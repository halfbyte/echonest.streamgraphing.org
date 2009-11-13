class FeedItem < ActiveRecord::Base
  
  ECHONEST_API_VERSION = "3"
  
  include HTTParty
  base_uri 'developer.echonest.com/api/'

  def self.artists
    @@artists ||= FeedItem.all(:select => "DISTINCT(artist)").map(&:artist).sort
  end

  def self.data_for_streamgraph(start_date = nil)
    min_date = FeedItem.minimum(:published_on)
    
    min_date = start_date if start_date && min_date < start_date
    
    max_date = FeedItem.maximum(:published_on)
    
    min_year = min_date.year
    min_week = min_date.cweek
    
    max_year = max_date.year
    max_week = max_date.cweek
    
    puts "from year: #{min_year} / cw: #{min_week}"
    puts "to   year: #{max_year} / cw: #{max_week}"
    
    current_week = 0
    
    data = []
    weeks = []
    self.hottt_artists.length.times { data << [] }
    
    loop do
      year = min_year + ((min_week + current_week) / 53)
      cw = (min_week + current_week) % 53
      break if (year >= max_year && cw > max_week)
      
      items = FeedItem.find_all_by_pub_year_and_pub_cw(year, cw)
      
      items_per_artist = {}
      
      items.each do |item|
        if artists.include?(item.artist)
          items_per_artist[item.artist] = (items_per_artist[item.artist] ? items_per_artist[item.artist] + 1 : 1)
        end
      end
      
      self.hottt_artists.length.times { |i| data[i] << 0 }
      items_per_artist.each do |artist, count|
        if self.hottt_artists.include?(artist)
          data[self.hottt_artists.index(artist)][current_week] = count
        end
      end
      weeks[current_week] = "CW#{cw} #{year}"
      current_week += 1
      
    end
    # self.artists.length.times { |i| data[i] << 0 }
    # self.artists.length.times { |i| data[i] << 0 }
    [weeks, data]
    
  end

  def self.hottt_artists
    @@hottt_artists ||=
      self.get("/get_top_hottt_artists", :query => { :api_key => SiteConfig::ECHONEST_KEY, :version => ECHONEST_API_VERSION })["response"]["artists"]["artist"].map { |artist| artist["name"] }
  end

  def self.update
    self.hottt_artists.each do |artist|
      urls = [
        "http://developer.echonest.com/artist/#{artist}/news.rss",
        "http://developer.echonest.com/artist/#{artist}/blogs.rss"
      ]
      urls.each do |url|
        feed = FeedTools::Feed.open(url)
        feed.items.each do |item|
          unless FeedItem.find_by_uid_and_artist(item.id, artist)
            date = item.time.to_date
            FeedItem.create(
              :published_on => date,
              :pub_year => date.year,
              :pub_cw => date.cweek,
              :pub_month => date.month,
              :link => item.link,
              :uid => item.id,
              :title => item.title,
              :description => item.description,
              :artist => artist
            )
          end
        end
      end
      
    end
  end
end
