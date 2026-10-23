class PagesController < ApplicationController
  # Lab 3: the admin page needs a login (see ApplicationController#require_login)
  before_action :require_login, only: :admin

  # Lab 3: contact messages are saved in this text file (one message per line, as JSON)
  MESSAGES_FILE = Rails.root.join("storage", "messages.txt")

  def home
  end

  def what_is
  end

  def contact
  end

  # Receives the contact form.
  # Lab 3: the same rules are checked in JavaScript first (contact_form_controller.js),
  # and checked again here in case JavaScript is turned off.
  def send_message
    name    = params[:name].to_s.strip
    email   = params[:email].to_s.strip
    topic   = params[:topic].to_s.strip
    message = params[:message].to_s.strip

    if name.empty? || email.empty? || message.empty?
      flash[:error] = "Please fill in your name, email and message."
    elsif !email.match?(URI::MailTo::EMAIL_REGEXP)
      flash[:error] = "Please enter a valid email address."
    elsif message.length > 500
      flash[:error] = "Your message is too long (500 characters maximum)."
    else
      save_message(name: name, email: email, topic: topic, message: message)
      topic_text = topic.empty? ? "" : " about \"#{topic}\""
      flash[:notice] = "Thank you, #{name}. Your message#{topic_text} has been received."
    end

    redirect_to contact_path
  end

  def law_enforcement
  end

  def enforcer
  end

  def hotline
  end

  # Lab 3: GET /admin - lists the saved contact messages, newest first
  def admin
    @messages = read_messages.reverse
  end

  private

  # File handling: adds one line to storage/messages.txt
  def save_message(fields)
    FileUtils.mkdir_p(MESSAGES_FILE.dirname)
    record = fields.merge(sent_at: Time.current.in_time_zone("Kuala Lumpur").strftime("%-d %b %Y, %-I:%M %p"))
    File.open(MESSAGES_FILE, "a") { |file| file.puts(record.to_json) }
  end

  # File handling: reads every line of storage/messages.txt back into a list
  def read_messages
    return [] unless File.exist?(MESSAGES_FILE)

    File.readlines(MESSAGES_FILE, chomp: true).filter_map do |line|
      JSON.parse(line)
    rescue JSON::ParserError
      nil   # skip a broken line instead of crashing the page
    end
  end
end
