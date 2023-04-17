#shellcheck shell=sh

Describe "Threatcode test command"
  Before threatcode_login
  After threatcode_logout

  Describe "Java Gradle test"
    It "finds vulns in a project when pointing to a folder"
      Skip if "execute only in regression test" check_if_regression_test
      When run threatcode test ../fixtures/gradle-prune-repeated-deps/
      The status should be failure # issues found
      The output should include "Upgrade com.google.guava:guava@18.0"
      The stderr should equal ""
    End
  End

  Describe "Python pip test"
    install_pip_and_run_threatcode_test() {
      cd ../acceptance/workspaces/pip-app/ || return
      pip install -r requirements.txt
      threatcode test
    }
    It "finds vulns in a project when pointing to a folder"
      Skip if "execute only in regression test" check_if_regression_test
      When run install_pip_and_run_threatcode_test
      The status should be failure # issues found
      The output should include "Upgrade jinja2@2.7.2"
      The stderr should equal ""
    End
  End


  Describe "npm test"
    run_test_in_subfolder() {
      cd ../fixtures/basic-npm || return
      threatcode test
    }

    run_test_in_empty_subfolder() {
      cd ../fixtures/empty || return
      threatcode test
    }

    It "throws error when file does not exist"
      When run threatcode test --file=non-existent/package.json
      The status should equal 2
      The output should include "Could not find the specified file"
      The stderr should equal ""
    End

    It "throws error when no suppored manifests detected"
      When run run_test_in_empty_subfolder
      The status should equal 3
      The output should include "Could not detect supported target files in"
      The stderr should equal ""
    End

    It "finds vulns in a project in the same folder"
      When run run_test_in_subfolder
      The status should equal 1
      The output should include "https://security.threatcode.io/vuln/npm:minimatch:20160620"
    End

    It "finds vulns in a project when pointing to a folder"
      When run threatcode test ../fixtures/basic-npm
      The status should be failure # issues found
      The output should include "https://security.threatcode.io/vuln/npm:minimatch:20160620"
    End

    It "finds vulns in a project when pointing to a file"
      When run threatcode test --file=../fixtures/basic-npm/package.json
      The status should be failure # issues found
      The output should include "https://security.threatcode.io/vuln/npm:minimatch:20160620"
    End

    It "tests a library on a specific version when passed a library@version"
      Skip if "execute only in regression test" check_if_regression_test
      When run threatcode test lodash@4.17.15
      The status should be failure # issues found
      The output should include "Testing lodash@4.17.15"
      The stderr should equal ""
    End

    It "fails with a correct user message on a non-existent library"
      Skip if "execute only in regression test" check_if_regression_test
      When run threatcode test nonexistentpackage123456789
      The status should be failure
      The output should include "Couldn't find the requested package or version"
      The stderr should equal ""
    End

    It "fails with a correct user message on a non-existent library"
      Skip if "execute only in regression test" check_if_regression_test
      When run threatcode test lodash --org=nope
      The status should be failure
      The output should include "Org nope was not found or you may not have the correct permissions"
      The stderr should equal ""
    End
  End

  Describe "npm test with JSON output"
    It "outputs a valid JSON with vulns"
      When run threatcode test ../fixtures/basic-npm --json
      The status should be failure # issues found
      The output should include "npm:minimatch:20160620"
      The output should include '"vulnerabilities": ['
      The stderr should equal ""
      The result of function check_valid_json should be success
    End
  End

  Describe "npm test with JSON output and all-projects flag"
    threatcode_test_json_all() {
      cd ../fixtures || return
      threatcode test --json --all-projects
    }

    # https://github.com/threatcode/threatcode/pull/1324
    # Captures an issue with extra output in stderr when json flag was set and some project failed to test
    It "won't output to stderr when one project fails and json flag is set"
      When run threatcode_test_json_all
      The status should be failure # issues found
      The stderr should equal ""
      The result of function check_valid_json should be success
    End
  End
End
