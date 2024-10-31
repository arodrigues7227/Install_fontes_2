module.exports = [{
  script: 'dist/server.js',
  name: 'waticket-back',
  exec_mode: 'fork',
  cron_restart: '05 00 * * *', // Reinicia o servidor às 05:00
  max_memory_restart: '1024M', // Configuração para reiniciar quando atingir 1024 MB de memória
  node_args: '--max-old-space-size=1024', // Limite de memória do Node.js para 1024 MB
  watch: false
}]