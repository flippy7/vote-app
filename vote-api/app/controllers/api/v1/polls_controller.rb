class Api::V1::PollsController < ApplicationController
  def index
    render json: Poll.all, include: :votes
  end

  def show
    poll = Poll.find(params[:id])
    render json: poll, include: :votes
  end
  def create
    poll = Poll.new(title: params[:title])
    if poll.save
      params[:options].each do |option|
        poll.votes.create(option: option)
      end
      render json: poll, status: :created
    else
      render json: { errors: poll.errors.full_messages }, status: :unprocessable_entity
    end
  end
def update
  poll = Poll.find(params[:id])

  # Оновлення заголовка
  poll.title = params[:title]

  # Оновлення або додавання варіантів
  existing_options = poll.votes.pluck(:option)
  new_options = params[:options] - existing_options
  removed_options = existing_options - params[:options]

  # Видалення варіантів, яких більше немає
  poll.votes.where(option: removed_options).destroy_all

  # Додавання нових варіантів
  new_options.each { |opt| poll.votes.create(option: opt) }

  if poll.save
    render json: poll, include: :votes
  else
    render json: { errors: poll.errors.full_messages }, status: :unprocessable_entity
  end
end

end
