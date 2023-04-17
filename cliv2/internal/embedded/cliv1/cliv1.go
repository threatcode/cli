package cliv1

import (
	_ "embed"
	"path"
	"strings"

	"github.com/threatcode/cli/cliv2/internal/embedded"
	"github.com/threatcode/cli/cliv2/internal/utils"
)

//go:embed cliv1.version
var threatcodeCLIVersion string

func CLIV1Version() string {
	return strings.TrimSpace(threatcodeCLIVersion)
}

// Get the full path to where we expect the CLIv1 to be in the cache
// If it doesn't exist, this is the path where we will then extract it
func GetFullCLIV1TargetPath(cacheDir string) (string, error) {
	cliv1Filename := getCLIv1Filename()
	versionTag := CLIV1Version()
	fullPath := path.Join(utils.GetVersionCacheDirectory(cacheDir, versionTag), cliv1Filename)
	return fullPath, nil
}

func ExtractTo(targetFullPath string) error {
	return embedded.ExtractBytesToTarget(threatcodeCLIBytes, targetFullPath)
}
