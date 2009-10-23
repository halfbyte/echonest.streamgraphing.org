class CreateFeedItems < ActiveRecord::Migration
  def self.up
    create_table :feed_items do |t|
      t.string :artist
      t.string :title
      t.text :description
      t.date :published_on
      t.integer :pub_year
      t.integer :pub_cw
      t.integer :pub_month
      t.string :link
      t.string :uid

      t.timestamps
    end
  end

  def self.down
    drop_table :feed_items
  end
end
