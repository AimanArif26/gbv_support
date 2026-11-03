class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  stale_when_importmap_changes

  helper_method :current_user, :logged_in?

  private

  def current_user
    session[:username]
  end

  def logged_in?
    current_user.present?
  end

  def require_login
    unless logged_in?
      flash[:error] = "Please log in to see that page."
      redirect_to login_path
    end
  end
end
