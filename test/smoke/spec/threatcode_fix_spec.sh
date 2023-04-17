#shellcheck shell=sh

Describe "Threatcode fix command logged in"
  Before threatcode_login
  After threatcode_logout

  Describe "supported only with FF"

    It "by default threatcode fix is not supported"
      When run threatcode fix
      The status should be failure
      The output should include "is not supported"
      The stderr should equal ""
    End
  End
End

Describe "Threatcode fix command logged out"
  Before threatcode_logout

  Describe "Bubbles up auth error"

    It "not authed"
      When run threatcode fix
      The status should be failure
      The output should include "Not authorised"
      The stderr should equal ""
    End
  End
End
