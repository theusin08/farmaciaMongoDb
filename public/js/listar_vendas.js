document.addEventListener('DOMContentLoaded', () => {
    fetch('/vendas')
        .then(response => response.json())
        .then(data => {
            const vendasList = document.getElementById('vendas-list');
            vendasList.innerHTML = data.map(venda => `
                <tr>
                    <td>${new Date(venda.dataCompra).toLocaleDateString()}</td>
                    <td>${venda.pacienteId}</td>
                    <td>${venda.medicamentoId}</td>
                    <td>${venda.quantidade}</td>
                    <td><button class="btn btn-danger btn-sm" data-id="${venda._id}" data-collection="vendas">Excluir</button></td>
                </tr>
            `).join('');

            // Adiciona os event listeners para os botões de exclusão
            document.querySelectorAll('.btn-danger').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    const collection = event.target.getAttribute('data-collection');

                    fetch(`/deletar/${collection}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    })
                    .then(response => {
                        if (response.ok) {
                            alert('Venda excluída com sucesso!');
                            event.target.closest('tr').remove();
                        } else {
                            alert('Erro ao excluir venda.');
                        }
                    })
                    .catch(error => console.error('Erro ao excluir venda:', error));
                });
            });
        })
        .catch(error => console.error('Erro ao carregar vendas:', error));
});
