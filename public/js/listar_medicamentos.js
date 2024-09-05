document.addEventListener('DOMContentLoaded', () => {
    fetch('/medicamentos')
        .then(response => response.json())
        .then(data => {
            const medicamentosList = document.getElementById('medicamentos-list');
            medicamentosList.innerHTML = data.map(medicamento => `
                <tr>
                    <td>${medicamento.nome}</td>
                    <td>${medicamento.codigoRegistro}</td>
                    <td>${medicamento.dosagem}</td>
                    <td><button class="btn btn-danger btn-sm" data-id="${medicamento._id}" data-collection="medicamentos">Excluir</button></td>
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
                            alert('Medicamento excluído com sucesso!');
                            event.target.closest('tr').remove();
                        } else {
                            alert('Erro ao excluir medicamento.');
                        }
                    })
                    .catch(error => console.error('Erro ao excluir medicamento:', error));
                });
            });
        })
        .catch(error => console.error('Erro ao carregar medicamentos:', error));
});
