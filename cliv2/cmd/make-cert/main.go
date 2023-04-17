package main

import (
	"fmt"
	"log"
	"os"
	"path"
	"strings"

	"github.com/threatcode/cli/cliv2/internal/utils"
	"github.com/threatcode/go-application-framework/pkg/networking/certs"
)

func main() {
	certName := os.Args[1]

	debugLogger := log.Default()

	threatcodeDNSNamesStr := os.Getenv("THREATCODE_DNS_NAMES")
	var threatcodeDNSNames []string
	fmt.Println("THREATCODE_DNS_NAMES:", threatcodeDNSNamesStr)
	if threatcodeDNSNamesStr != "" {
		threatcodeDNSNames = strings.Split(threatcodeDNSNamesStr, ",")
	} else {
		// We use app.dev.threatcode.io for development
		threatcodeDNSNames = []string{"threatcode.io", "*.threatcode.io", "*.dev.threatcode.io"}
	}

	debugLogger.Println("certificate name:", certName)
	debugLogger.Println("THREATCODE_DNS_NAMES:", threatcodeDNSNames)

	certPEMBlockBytes, keyPEMBlockBytes, err := certs.MakeSelfSignedCert(certName, threatcodeDNSNames, debugLogger)
	if err != nil {
		log.Fatal(err)
	}

	// certString := certPEMBytesBuffer.String()
	certPEMString := string(certPEMBlockBytes)
	keyPEMString := string(keyPEMBlockBytes)

	keyAndCert := keyPEMString + certPEMString

	// write to file
	certFilePath := path.Join(".", certName+".crt")
	keyFilePath := path.Join(".", certName+".key")
	joinedPemFilePath := path.Join(".", certName+".pem") // key and cert in one file - used by mitmproxy

	_ = utils.WriteToFile(certFilePath, certPEMString)
	_ = utils.WriteToFile(keyFilePath, keyPEMString)
	_ = utils.WriteToFile(joinedPemFilePath, keyAndCert)
}
