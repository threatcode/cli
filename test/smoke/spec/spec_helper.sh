#shellcheck shell=sh
set -e

spec_helper_precheck() {
  setenv CI=1 # This flag influences behavior of `threatcode auth` so it needs to be explicitly set
  setenv ORIGINAL_THREATCODE_EXECUTABLE="$(which threatcode)"
}

spec_helper_configure() {
  print_threatcode_config() {
    threatcode config
  }

  threatcode_login() {
    threatcode config set api="${SMOKE_TESTS_THREATCODE_TOKEN}" 1> /dev/null
  }

  threatcode_logout() {
    threatcode config clear > /dev/null 2>&1
  }

  verify_login_url() {
    # https://threatcode.io/login?token=uuid-token&utm_medium=cli&utm_source=cli&utm_campaign=cli&os=darwin&docker=false
    echo "$1" | grep https | grep -E "^https://(app\.)?(dev\.)?(test\.)?threatcode\.io/login\?token=[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}\&.*$"
  }

  # Consume stdout and checks validates whether it's a valid JSON
  check_valid_json() {
    printf %s "$1" | jq . > /dev/null
    echo $?
  }

  # These 2 commands should run in succession, some CLI functionality uses isCI detection
  disable_is_ci_flags() {
    # save original value and unset
    if [ -n "${CI}" ]; then CI_BACKUP_VALUE="$CI"; unset CI; fi
    if [ -n "${CIRCLECI}" ]; then CIRCLECI_BACKUP_VALUE="$CIRCLECI"; unset CIRCLECI; fi
  }
  restore_is_ci_flags() {
    # recover the original value
    if [ -n "${CI}" ]; then CI="$CI_BACKUP_VALUE"; unset CI_BACKUP_VALUE; fi
    if [ -n "${CIRCLECI}" ]; then CIRCLECI="$CIRCLECI_BACKUP_VALUE"; unset CIRCLECI_BACKUP_VALUE; fi
  }

  check_if_regression_test() { ! [ "${REGRESSION_TEST}" = "1" ]; }

  check_auth_output() {
    printf %s "$1" | grep -F -e "To authenticate your account, open the below URL in your browser." -e "Now redirecting you to our auth page, go ahead and log in," > /dev/null
    echo $?
  }

  echo "
\033[1mS n y k  C L I\033[0m
███████╗███╗   ███╗ ██████╗ ██╗  ██╗███████╗    ████████╗███████╗███████╗████████╗███████╗
██╔════╝████╗ ████║██╔═══██╗██║ ██╔╝██╔════╝    ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
███████╗██╔████╔██║██║   ██║█████╔╝ █████╗         ██║   █████╗  ███████╗   ██║   ███████╗
╚════██║██║╚██╔╝██║██║   ██║██╔═██╗ ██╔══╝         ██║   ██╔══╝  ╚════██║   ██║   ╚════██║
███████║██║ ╚═╝ ██║╚██████╔╝██║  ██╗███████╗       ██║   ███████╗███████║   ██║   ███████║
╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝       ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝
"

  echo "Using this 'threatcode' executable:"
  echo "${THREATCODE_COMMAND:=$ORIGINAL_THREATCODE_EXECUTABLE}"
  echo " "
  echo "You may override it with envvar THREATCODE_COMMAND - e.g. THREATCODE_COMMAND=\"node ./bin/threatcode\" to test a local build"
  echo " "

  threatcode() {
    eval "${THREATCODE_COMMAND:=$ORIGINAL_THREATCODE_EXECUTABLE}" "$@"
  }
}
