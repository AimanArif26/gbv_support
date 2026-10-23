class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  # Lab 3: these methods can also be used in the views (e.g. the navbar)
  helper_method :current_user, :logged_in?

  private

  # The username saved in the session after a successful login
  def current_user
    session[:username]
  end

  def logged_in?
    current_user.present?
  end

  # Used as a before_action on pages that need a login
  def require_login
    unless logged_in?
      flash[:error] = "Please log in to see that page."
      redirect_to login_path
    end
  end
end
