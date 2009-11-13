class MusicController < ApplicationController
  def index
    if params[:weeks].blank?
      weeks = 12
    else
      weeks = params[:weeks].try(:to_i) || 12
    end
    @artists = FeedItem.hottt_artists
    from_date = nil
    from_date = weeks.weeks.ago.to_date
    @x_data, @y_data = FeedItem.data_for_streamgraph(from_date)
  end
  
  def articles
    
  end

end
