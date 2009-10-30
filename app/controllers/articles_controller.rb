class ArticlesController < ApplicationController
  
  def index
    @artist = params[:query]
    unless @artist.blank?
      @articles = FeedItem.find_all_by_artist(@artist, :order => 'published_on DESC', :limit => 20)
    else
      @articles = FeedItem.all(:order => 'published_on DESC', :limit => 20)
    end
    if request.xhr?
      render :layout => false and return
    end
      
  end
  
end
