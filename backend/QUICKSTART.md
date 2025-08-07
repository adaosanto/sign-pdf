# 🚀 Início Rápido - PDF Signer API

## Opção 1: Execução Local (Recomendado para desenvolvimento)

### Pré-requisitos
- Node.js 16+ 
- npm

### Passos
1. **Navegue para o diretório backend:**
   ```bash
   cd backend
   ```

2. **Execute o script de inicialização:**
   ```bash
   ./start.sh
   ```
   
   Ou manualmente:
   ```bash
   npm install
   cp env.example .env
   npm run dev
   ```

3. **Acesse a aplicação:**
   - Interface web: http://localhost:3000
   - API: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

## Opção 2: Docker (Recomendado para produção)

### Pré-requisitos
- Docker
- Docker Compose

### Passos
1. **Navegue para o diretório backend:**
   ```bash
   cd backend
   ```

2. **Execute com Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação:**
   - Interface web: http://localhost:3000
   - API: http://localhost:3000/api
   - Interface web (Docker): http://localhost:8080

## 🧪 Testando a Aplicação

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Informações da API
```bash
curl http://localhost:3000/api/pdf/info
```

### 3. Assinar um PDF
```bash
curl -X POST http://localhost:3000/api/pdf/sign \
  -F "pdf=@seu-arquivo.pdf" \
  -F "name=Seu Nome" \
  -F "reason=Aprovação" \
  --output documento-assinado.pdf
```

### 4. Interface Web
Abra `examples/example-usage.html` no navegador para uma interface gráfica.

## 📁 Estrutura de Arquivos

```
backend/
├── src/                    # Código fonte
│   ├── server.js          # Servidor principal
│   ├── routes/            # Rotas da API
│   ├── services/          # Lógica de negócio
│   └── middleware/        # Middlewares
├── examples/              # Exemplos de uso
├── test/                  # Testes
├── uploads/               # Arquivos temporários
├── package.json           # Dependências
├── Dockerfile             # Configuração Docker
├── docker-compose.yml     # Orquestração Docker
├── start.sh              # Script de inicialização
└── README.md             # Documentação completa
```

## 🔧 Configurações

### Variáveis de Ambiente (.env)
```env
PORT=3000                    # Porta do servidor
NODE_ENV=development         # Ambiente
MAX_FILE_SIZE=10485760       # Tamanho máximo (10MB)
UPLOAD_PATH=./uploads        # Diretório de uploads
```

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test
npm run test:basic

# Docker
docker-compose up -d        # Iniciar
docker-compose down         # Parar
docker-compose logs         # Ver logs
```

## 🆘 Solução de Problemas

### Erro: "Port already in use"
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 <PID>
```

### Erro: "Permission denied" no start.sh
```bash
chmod +x start.sh
```

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Docker não inicia
```bash
# Verificar se Docker está rodando
docker --version
docker-compose --version

# Reconstruir imagem
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📞 Suporte

- 📖 Documentação completa: `README.md`
- 🧪 Testes: `npm run test:basic`
- 🔍 Logs: `docker-compose logs` (se usando Docker)
- 🌐 Interface web: `examples/example-usage.html`

## 🎯 Próximos Passos

1. Teste a API com um PDF real
2. Explore os endpoints em `http://localhost:3000/api/pdf/info`
3. Use a interface web para upload e assinatura
4. Personalize as configurações no arquivo `.env`
5. Consulte a documentação completa em `README.md`
