class MusicController < ApplicationController
  def index
    @artists = FeedItem.artists
    from_date = nil
    
    from_date = params[:weeks].try(:to_i).try(:weeks).try(:ago).try(:to_date) unless (params[:weeks].blank?)
    puts from_date.inspect
    @x_data, @y_data  = FeedItem.data_for_streamgraph(from_date)
  end
  
  def articles
    
  end

end
