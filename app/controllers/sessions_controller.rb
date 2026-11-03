class SessionsController < ApplicationController
  PASSWORD_FILE = Rails.root.join("Password.txt")

  def new
    redirect_to admin_path if logged_in?
  end

  def create
    username = params[:username].to_s.strip
    password = params[:password].to_s

    if username.empty? || password.empty?
      flash.now[:error] = "Please enter your username and password."
      render :new, status: :unprocessable_entity
    elsif valid_user?(username, password)
      reset_session                       # start a fresh session after login
      session[:username] = username
      session[:logged_in_at] = Time.current.in_time_zone("Kuala Lumpur").strftime("%-d %B %Y, %-I:%M %p")
      flash[:notice] = "Welcome, #{username}! You are logged in."
      redirect_to admin_path
    else
      flash.now[:error] = "Wrong username or password. Please try again."
      render :new, status: :unprocessable_entity
    end
  rescue Errno::ENOENT
    flash.now[:error] = "Login is not available right now (Password.txt was not found)."
    render :new, status: :unprocessable_entity
  end

  def destroy
    name = current_user
    reset_session
    flash[:notice] = name ? "Goodbye, #{name}. You have logged out." : "You have logged out."
    redirect_to root_path
  end

  private

  def valid_user?(username, password)
    File.readlines(PASSWORD_FILE, chomp: true).any? do |line|
      next false if line.strip.empty? || line.start_with?("#")   # skip blank lines and comments

      saved_name, saved_password = line.split(":", 2).map(&:strip)
      saved_name == username &&
        ActiveSupport::SecurityUtils.secure_compare(saved_password.to_s, password)
    end
  end
end
