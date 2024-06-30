document.addEventListener('DOMContentLoaded', function() {
    const username = 'PACX0';
    const githubUrl = `https://github.com/${username}`;

    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(user => {
            if (user) {
                document.getElementById('profile-image').src = user.avatar_url || 'default.jpg';
                document.getElementById('profile-name').textContent = user.name || 'No name provided';
                document.getElementById('navbar-user-name').textContent = user.name || 'Nome do Usuário';
                document.getElementById('profile-bio').textContent = user.bio || 'No bio available';
                document.getElementById('profile-location').innerHTML = `<b>Localização:</b> ${user.location || 'Not specified'}`;
                document.getElementById('profile-followers').textContent = `Seguidores: ${user.followers || 0}`;
                document.getElementById('github-link').href = githubUrl;
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });

    // Fetch repositórios do usuário
    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            if (repos && repos.length > 0) {
                const reposContainer = document.getElementById('repos-container');
                repos.forEach(repo => {
                    const repoCard = document.createElement('div');
                    repoCard.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-3');
                    repoCard.innerHTML = `
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a class="nav-link link-primary" href="repo.html?username=${username}&repo=${repo.name}"><b>${repo.name}</b></a>
                                </h5>
                                <p class="card-text">${repo.description ? repo.description : 'No description available.'}</p>
                                <div class="d-flex justify-content-between mt-3">
                                    <div class="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star me-2" viewBox="0 0 16 16">
                                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                                        </svg>
                                        <p class="mb-0">${repo.stargazers_count}</p>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person text-primary me-2" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                        </svg>
                                        <p class="mb-0">${repo.watchers_count}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    reposContainer.appendChild(repoCard);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar repositórios:', error);
        });

    // Fetch conteúdo sugerido
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const contents = data.contents;
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicators = document.getElementById('carousel-indicators');

            contents.forEach((content, index) => {
                // Criar item do carrossel
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active');
                }
                carouselItem.innerHTML = `
                    <img src="${content.image}" class="d-block w-100" alt="${content.title}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>${content.title}</h5>
                        <p>${content.description}</p>
                        <a href="${content.link}" class="btn btn-primary" target="_blank">Saiba mais</a>
                    </div>
                `;
                carouselInner.appendChild(carouselItem);

                // Criar indicador do carrossel
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
                indicator.setAttribute('data-bs-slide-to', index);
                if (index === 0) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-current', 'true');
                }
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                carouselIndicators.appendChild(indicator);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o conteúdo sugerido:', error);
        });

    // Fetch colegas
    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const colleagues = data.colleagues;
            const colleaguesContainer = document.getElementById('colleagues-container');
            
            if (!colleaguesContainer) {
                console.error('Elemento com ID "colleagues-container" não encontrado.');
                return;
            }

            if (!Array.isArray(colleagues) || colleagues.length === 0) {
                console.error('Nenhum dado de colega encontrado.');
                return;
            }

            colleagues.forEach(colleague => {
                const colleagueCard = document.createElement('div');
                colleagueCard.classList.add('col-6', 'col-md-4', 'col-lg-3', 'mb-3');
                colleagueCard.innerHTML = `
                    <div class="card h-100 text-center shadow-sm">
                        <a href="https://github.com/${colleague.username}" target="_blank">
                            <img src="${colleague.image}" class="card-img-top rounded-circle mx-auto mt-3" alt="${colleague.name}" style="width: 100px; height: 100px;">
                            <div class="card-body">
                                <p class="card-text"><b>${colleague.name}</b></p>
                            </div>
                        </a>
                    </div>
                `;
                colleaguesContainer.appendChild(colleagueCard);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados dos colegas:', error);
        });
});
