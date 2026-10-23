require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get pages_home_url
    assert_response :success
  end

  test "should get what_is" do
    get pages_what_is_url
    assert_response :success
  end

  test "should get contact" do
    get pages_contact_url
    assert_response :success
  end

  test "should get law_enforcement" do
    get pages_law_enforcement_url
    assert_response :success
  end

  test "should get enforcer" do
    get pages_enforcer_url
    assert_response :success
  end

  test "should get hotline" do
    get pages_hotline_url
    assert_response :success
  end
end
