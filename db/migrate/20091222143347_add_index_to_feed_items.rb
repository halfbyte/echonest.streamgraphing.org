class AddIndexToFeedItems < ActiveRecord::Migration
  def self.up
    add_index :feed_items, [:pub_year, :pub_cw]
  end

  def self.down
    remove_index :column => [:pub_year, :pub_cw]
  end
end
