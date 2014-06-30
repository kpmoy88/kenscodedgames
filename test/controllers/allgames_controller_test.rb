require 'test_helper'

class AllgamesControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

end
