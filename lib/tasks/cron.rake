task :cron => :environment do
  FeedItem.update
end