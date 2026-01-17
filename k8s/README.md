# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the User Platform API.

## 📋 Architecture

```
┌─────────────────────────────────────────┐
│         LoadBalancer Service            │
│          (user-platform-api)            │
│              Port 80 → 3000             │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┴──────────┬───────────┐
      │                      │           │
┌─────▼──────┐   ┌──────▼──────┐   ┌────▼──────┐
│   Pod 1    │   │   Pod 2     │   │   Pod 3   │
│   API      │   │   API       │   │   API     │
│ (replica)  │   │ (replica)   │   │ (replica) │
└─────┬──────┘   └──────┬──────┘   └────┬──────┘
      │                 │                │
      └─────────────────┼────────────────┘
                        │
              ┌─────────▼─────────┐
              │ ClusterIP Service │
              │    (postgres)     │
              │    Port 5432      │
              └─────────┬─────────┘
                        │
                  ┌─────▼──────┐
                  │ PostgreSQL │
                  │    Pod     │
                  │   + PVC    │
                  └────────────┘
```

## 🚀 Deployment Steps

### Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker image built

### 1. Build Docker Image

```bash
# Build the application image
docker build -t user-platform-api:latest .

# Tag for your registry (optional)
docker tag user-platform-api:latest your-registry/user-platform-api:latest
docker push your-registry/user-platform-api:latest
```

### 2. Update Secrets (IMPORTANT!)

Edit `app-secret.yaml` and replace placeholder values:

```bash
kubectl create secret generic app-secret \
  --from-literal=db-password='your_secure_password' \
  --from-literal=metrics-api-key='your_api_key' \
  -n user-platform --dry-run=client -o yaml > app-secret.yaml
```

### 3. Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Deploy PostgreSQL
kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml

# Wait for PostgreSQL to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n user-platform --timeout=120s

# Deploy Application
kubectl apply -f app-configmap.yaml
kubectl apply -f app-secret.yaml
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml

# Wait for application to be ready
kubectl wait --for=condition=ready pod -l app=user-platform-api -n user-platform --timeout=120s
```

### 4. Deploy All at Once

```bash
# Deploy everything in order
kubectl apply -f k8s/
```

## 🔍 Verify Deployment

```bash
# Check all resources
kubectl get all -n user-platform

# Check pods
kubectl get pods -n user-platform

# Check services
kubectl get svc -n user-platform

# Check logs
kubectl logs -f deployment/user-platform-api -n user-platform

# Check PostgreSQL logs
kubectl logs -f deployment/postgres -n user-platform
```

## 🌐 Access the API

```bash
# Get the LoadBalancer IP/hostname
kubectl get svc user-platform-api -n user-platform

# Test the API
EXTERNAL_IP=$(kubectl get svc user-platform-api -n user-platform -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl http://$EXTERNAL_IP/health
curl http://$EXTERNAL_IP/users
```

## 🔧 Configuration

### Scaling

```bash
# Scale up replicas
kubectl scale deployment user-platform-api --replicas=5 -n user-platform

# Autoscaling (HPA)
kubectl autoscale deployment user-platform-api \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n user-platform
```

### Update Image

```bash
# Update deployment with new image
kubectl set image deployment/user-platform-api \
  api=user-platform-api:v2.0.0 \
  -n user-platform

# Check rollout status
kubectl rollout status deployment/user-platform-api -n user-platform

# Rollback if needed
kubectl rollout undo deployment/user-platform-api -n user-platform
```

### Resource Management

```bash
# View resource usage
kubectl top pods -n user-platform
kubectl top nodes

# Describe deployment
kubectl describe deployment user-platform-api -n user-platform
```

## 🐛 Troubleshooting

### Pods Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n user-platform

# Check logs
kubectl logs <pod-name> -n user-platform

# Check previous logs (if crashed)
kubectl logs <pod-name> -n user-platform --previous
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
kubectl get pods -l app=postgres -n user-platform

# Test connection from API pod
kubectl exec -it <api-pod-name> -n user-platform -- sh
apk add postgresql-client
psql -h postgres -U postgres -d user_platform_db
```

### Check ConfigMap and Secrets

```bash
# View ConfigMap
kubectl get configmap app-config -n user-platform -o yaml

# Check Secret (base64 encoded)
kubectl get secret app-secret -n user-platform -o yaml
```

## 🗑️ Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete namespace (removes everything)
kubectl delete namespace user-platform
```

## 📊 Resource Specifications

### PostgreSQL

- **Replicas**: 1 (StatefulSet recommended for production)
- **CPU**: 250m - 1 core
- **Memory**: 256Mi - 512Mi
- **Storage**: 5Gi PVC

### API Application

- **Replicas**: 3 (horizontal scaling)
- **CPU**: 250m - 1 core per pod
- **Memory**: 256Mi - 512Mi per pod
- **Strategy**: RollingUpdate (zero-downtime)

## 🔐 Security Notes

1. **Secrets**: Update `app-secret.yaml` with secure values before deployment
2. **Network Policies**: Consider adding NetworkPolicy for pod-to-pod communication
3. **RBAC**: Implement Role-Based Access Control for production
4. **Image Security**: Use private registry and scan images for vulnerabilities
5. **TLS**: Add Ingress with TLS certificates for HTTPS

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)
