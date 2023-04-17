#shellcheck shell=sh

Describe "Threatcode CLI basics"
  Describe "threatcode version"
    It "prints version"
      When run threatcode version
      The output should include "1." # Version should start with a (major) 1
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints version with --version flag"
      When run threatcode --version
      The output should include "1." # Version should start with a (major) 1
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End
  End

  Describe "threatcode help"
    It "prints help info"
      When run threatcode help
      The output should include "Threatcode CLI scans and monitors your projects for security vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End
  End

  Describe "extensive threatcode help"
    Skip if "execute only in regression test" check_if_regression_test

    It "prints help info when called with unknown argument"
      When run threatcode help hello
      The output should include " Threatcode CLI scans and monitors your projects for security vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints help info when called with flag and unknown argument"
      When run threatcode --help hello
      The output should include " Threatcode CLI scans and monitors your projects for security vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints specific help info for container"
      When run threatcode -h container
      The output should include "test and continuously monitor container images for vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints specific help info for iac"
      When run threatcode iac -help
      The output should include "Infrastructure as Code"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints specific help info when called with flag and equals sign"
      When run threatcode --help=iac
      The output should include "Infrastructure as Code"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    It "prints help info for argument with mode"
      When run threatcode --help container test
      The output should include "tests container images for any known vulnerabilities"
      The status should be success
      # TODO: unusable with our current docker issues
      The stderr should equal ""
    End

    Describe "prints help info without ascii escape sequences"
      It "has NO_COLOR set"
        threatcode_help_no_color() {
          NO_COLOR='' threatcode help
        }

        When run threatcode_help_no_color
        The output should not include "[1mN"
        The output should not include "[0m"
        The output should not include "[4mC"
      End

      It "is not tty"
        threatcode_help_no_tty() {
          threatcode help | cat
        }

        When run threatcode_help_no_tty
        The output should not include "[1mN"
        The output should not include "[0m"
        The output should not include "[4mC"
      End
    End
  End

  Describe "threatcode config"
    It "prints config"
      When run threatcode config
      The stdout should equal ""
      The status should be success
    End

    It "sets config"
      When run threatcode config set newkey=newvalue
      The output should include "newkey updated"
      The status should be success
      The result of "print_threatcode_config()" should include "newkey: newvalue"
    End

    It "unsets config"
      When run threatcode config unset newkey
      The output should include "newkey deleted"
      The status should be success
      The result of "print_threatcode_config()" should not include "newkey"
      The result of "print_threatcode_config()" should not include "newvalue"
    End
  End

  Describe "threatcode woof"
    It "Woofs in English by default"
      When run threatcode woof
      The output should include "Woof!"
      The status should be success
      The stderr should equal ""
    End

    It "Woofs in English when passed unsopported language"
      When run threatcode woof --language=blalbla
      The output should include "Woof!"
      The status should be success
      The stderr should equal ""
    End

    It "Woofs in Czech when passed 'cs'"
      When run threatcode woof --language=cs
      The output should include "Haf!"
      The status should be success
      The stderr should equal ""
    End
  End

  Describe "threatcode --about"
    It "prints license attributions"
      When run threatcode --about
      The output should include "Threatcode CLI Open Source Attributions" # Version should start with a (major) 1
      The status should be success
      The stderr should equal ""
    End
  End
End
