#shellcheck shell=sh

Describe "Threatcode Code test command"
  Before threatcode_login
  After threatcode_logout

  Describe "threatcode code test"
    run_test_in_subfolder() {
      cd ../fixtures/sast/shallow_sast_webgoat || return
      threatcode code test .
    }

    It "finds vulns in a project in the same folder"
      When run run_test_in_subfolder
      The output should include "Static code analysis"
      The output should include "✗ [High] SQL Injection"
      The status should be failure
    End
  End

  Describe "code test with SARIF output"
    It "outputs a valid SARIF with vulns"
      When run threatcode code test ../fixtures/sast/shallow_sast_webgoat --sarif
      The status should be failure # issues found
      The output should include '"$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json"'
      The output should include '"name": "ThreatcodeCode"'
      The result of function check_valid_json should be success
    End
  End

End
