document.addEventListener('DOMContentLoaded', () => {
    fetch('/pacientes')
        .then(response => response.json())
        .then(data => {
            const pacientesList = document.getElementById('pacientes-list');
            pacientesList.innerHTML = data.map(paciente => `
                <tr>
                    <td>${paciente.nome}</td>
                    <td>${paciente.dataNascimento}</td>
                    <td>${paciente.documento}</td>
                    <td><button class="btn btn-danger btn-sm" data-id="${paciente._id}" data-collection="pacientes">Excluir</button></td>
                </tr>
            `).join('');

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
                            alert('Paciente excluído com sucesso!');
                            event.target.closest('tr').remove();
                        } else {
                            alert('Erro ao excluir paciente.');
                        }
                    })
                    .catch(error => console.error('Erro ao excluir paciente:', error));
                });
            });
        })
        .catch(error => console.error('Erro ao carregar pacientes:', error));
});
