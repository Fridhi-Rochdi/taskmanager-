# ====================================
# SCRIPT DE DEMARRAGE COMPLET
# Lancer au démarrage du PC
# ====================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DEMARRAGE DE L'ENVIRONNEMENT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Vérifier Docker
Write-Host "1. Verification Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if (-not $dockerRunning) {
    Write-Host "   Docker n'est pas lance!" -ForegroundColor Red
    Write-Host "   Ouvre Docker Desktop et relance ce script." -ForegroundColor Red
    exit 1
}
Write-Host "   Docker: OK`n" -ForegroundColor Green

# 2. Démarrer Minikube
Write-Host "2. Demarrage Minikube..." -ForegroundColor Yellow
$minikubeStatus = minikube status 2>$null
if ($minikubeStatus -match "Stopped" -or $minikubeStatus -match "does not exist") {
    Write-Host "   Demarrage de Minikube (2-3 minutes)..." -ForegroundColor Cyan
    minikube start --driver=docker
} else {
    Write-Host "   Minikube: Deja en cours d'execution" -ForegroundColor Green
}

# 3. Vérifier les pods
Write-Host "`n3. Verification des pods..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
kubectl get pods -n user-platform

# 4. Afficher les URLs
Write-Host "`n4. URLs d'acces:" -ForegroundColor Yellow

Write-Host "`n   Kubernetes Dashboard:" -ForegroundColor Cyan
Write-Host "   minikube dashboard" -ForegroundColor White

Write-Host "`n   Prometheus (Metriques):" -ForegroundColor Cyan
Write-Host "   minikube service prometheus -n user-platform" -ForegroundColor White

Write-Host "`n   API (Port-forward):" -ForegroundColor Cyan
Write-Host "   kubectl port-forward -n user-platform svc/user-platform-api 3000:80" -ForegroundColor White

# 5. Option: Lancer le Dashboard automatiquement
Write-Host "`n5. Voulez-vous ouvrir le Dashboard Kubernetes? (O/N)" -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "O" -or $response -eq "o") {
    Write-Host "   Ouverture du Dashboard..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "minikube dashboard"
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ENVIRONNEMENT PRET!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Commandes utiles:" -ForegroundColor Yellow
Write-Host "  .\demo-prometheus.ps1    - Demo Prometheus" -ForegroundColor White
Write-Host "  .\voir-logs.ps1          - Voir les logs API" -ForegroundColor White
Write-Host "  kubectl get all -n user-platform - Etat des services" -ForegroundColor White
Write-Host ""
