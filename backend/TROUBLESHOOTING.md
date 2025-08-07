# 🔧 Solução de Problemas - PDF Signer

## ❌ Erro: "Rota não encontrada"

### Problema
Você está recebendo o erro:
```json
{
  "error": "Rota não encontrada",
  "path": "/health"
}
```

### 🔍 Diagnóstico

#### 1. Verificar se o servidor está rodando
```bash
# Verificar se há algum processo na porta 3000
lsof -i :3000

# Ou usar netstat
netstat -tulpn | grep :3000
```

#### 2. Verificar se as dependências estão instaladas
```bash
cd backend
ls -la node_modules/
```

#### 3. Verificar se o arquivo .env existe
```bash
ls -la .env
```

### 🛠️ Soluções

#### Solução 1: Inicialização Completa
```bash
cd backend
./check-and-start.sh
```

#### Solução 2: Inicialização Manual
```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Criar arquivo de configuração
cp env.example .env

# 3. Criar diretório de uploads
mkdir -p uploads

# 4. Verificar se a porta está livre
lsof -i :3000
# Se estiver em uso, pare o processo:
# kill -9 <PID>

# 5. Iniciar o servidor
npm run dev
```

#### Solução 3: Teste Rápido
```bash
cd backend
node test-server.js
```

### 🚨 Problemas Comuns

#### 1. Porta 3000 já em uso
```bash
# Encontrar processo
lsof -i :3000

# Parar processo
kill -9 <PID>

# Ou usar uma porta diferente
PORT=3001 npm run dev
```

#### 2. Dependências não instaladas
```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 3. Arquivo .env não existe
```bash
# Criar arquivo .env
cat > .env << EOF
PORT=3000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
EOF
```

#### 4. Permissões de arquivo
```bash
# Dar permissão de execução aos scripts
chmod +x *.sh
```

### 🧪 Testes de Verificação

#### Teste 1: Health Check
```bash
curl http://localhost:3000/health
```
**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

#### Teste 2: API Info
```bash
curl http://localhost:3000/api
```
**Resposta esperada:**
```json
{
  "message": "PDF Signer API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "interface": "/interface",
    "signPdf": "/api/pdf/sign",
    "uploadPdf": "/api/pdf/upload",
    "apiInfo": "/api/pdf/info"
  }
}
```

#### Teste 3: Interface Web
```bash
curl -I http://localhost:3000/
```
**Resposta esperada:**
```
HTTP/1.1 200 OK
Content-Type: text/html
```

### 🔍 Logs de Debug

#### Habilitar logs detalhados
```bash
# Adicionar ao .env
DEBUG=* npm run dev

# Ou usar variável de ambiente
DEBUG=* npm run dev
```

#### Verificar logs do servidor
```bash
# Se usando PM2
pm2 logs

# Se usando Docker
docker-compose logs

# Logs do sistema
journalctl -u pdf-signer -f
```

### 📞 Comandos de Emergência

#### Reiniciar tudo
```bash
cd backend
pkill -f "node.*server.js"
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Usar Docker (alternativa)
```bash
cd backend
docker-compose down
docker-compose up -d
```

#### Verificar status completo
```bash
cd backend
./check-and-start.sh
```

### 🆘 Se Nada Funcionar

1. **Verificar versão do Node.js:**
   ```bash
   node --version  # Deve ser 16+
   npm --version
   ```

2. **Verificar espaço em disco:**
   ```bash
   df -h
   ```

3. **Verificar permissões:**
   ```bash
   ls -la
   ```

4. **Verificar firewall:**
   ```bash
   sudo ufw status
   ```

5. **Testar com curl local:**
   ```bash
   curl -v http://localhost:3000/health
   ```

### 📋 Checklist de Verificação

- [ ] Node.js 16+ instalado
- [ ] npm instalado
- [ ] Diretório backend/ existe
- [ ] package.json existe
- [ ] node_modules/ existe
- [ ] .env existe
- [ ] uploads/ existe
- [ ] Porta 3000 livre
- [ ] Scripts com permissão de execução
- [ ] Servidor iniciado sem erros

### 🎯 Próximos Passos

Se você ainda está enfrentando problemas:

1. Execute o script de diagnóstico: `./check-and-start.sh`
2. Verifique os logs de erro
3. Teste com o script de teste: `node test-server.js`
4. Consulte a documentação completa: `README.md`
5. Abra uma issue com os logs de erro
