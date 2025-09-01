package main

import (
	"os"
)

func getEnv(k, def string) string { if v := os.Getenv(k); v != "" { return v }; return def }
func getOrchestratorURL() string { return getEnv("ORCHESTRATOR_URL", "http://localhost:4002") }
func getCodegenURL() string { return getEnv("CODEGEN_URL", "http://localhost:4003") }
