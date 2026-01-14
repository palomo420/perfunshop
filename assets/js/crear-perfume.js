        // Sistema de almacenamiento (simulación de base de datos)
        let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
        let currentEditId = null;
        
        // URLs de imágenes por defecto para cada categoría
        const defaultImages = {
            hombre: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            mujer: 'https://images.unsplash.com/photo-1590736969955-0126f7e1e88d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
            ninos: 'https://images.unsplash.com/photo-1593990965213-7c8c536fe78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        };
        
        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar productos existentes
            loadPerfumes();
            
            // Configurar eventos
            setupEventListeners();
            
            // Inicializar vista previa de imagen
            updateImagePreview();
            
            // Inicializar vista previa de tarjeta
            updateCardPreview();
        });
        
        // Cargar perfumes desde el almacenamiento
        function loadPerfumes() {
            const productsGrid = document.getElementById('products-grid');
            productsGrid.innerHTML = '';
            
            if (perfumes.length === 0) {
                productsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #888;">No hay productos creados todavía. ¡Crea tu primer perfume!</p>';
                return;
            }
            
            perfumes.forEach(perfume => {
                const productCard = createProductCard(perfume);
                productsGrid.appendChild(productCard);
            });
            
            // Actualizar también la sección anterior (simulación)
            updateCatalogSection();
        }
        
        // Crear tarjeta de producto para la lista de administración
        function createProductCard(perfume) {
            const card = document.createElement('div');
            card.className = 'product-card-admin';
            card.dataset.id = perfume.id;
            
            // Determinar clase de categoría
            let categoryClass = 'product-category-admin';
            if (perfume.category === 'mujer') categoryClass += ' category-mujer-admin';
            if (perfume.category === 'ninos') categoryClass += ' category-ninos-admin';
            
            // Determinar texto de categoría
            let categoryText = 'Hombre';
            if (perfume.category === 'mujer') categoryText = 'Mujer';
            if (perfume.category === 'ninos') categoryText = 'Niños';
            
            card.innerHTML = `
                <div class="product-image-admin">
                    <img src="${perfume.image}" alt="${perfume.name}">
                </div>
                <div class="product-info-admin">
                    <h4 class="product-name-admin">${perfume.name}</h4>
                    <span class="${categoryClass}">${categoryText}</span>
                    <p style="color: #aaa; font-size: 0.9rem;">${perfume.brand}</p>
                    <p style="color: #fff; font-weight: bold; margin-top: 0.5rem;">$${perfume.price}</p>
                    <div class="product-actions">
                        <button class="action-btn edit-btn" onclick="editPerfume('${perfume.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="action-btn delete-btn" onclick="deletePerfume('${perfume.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            
            return card;
        }
        
        // Configurar eventos de los elementos del formulario
        function setupEventListeners() {
            // Vista previa de imagen en tiempo real
            document.getElementById('product-image').addEventListener('input', updateImagePreview);
            
            // Vista previa de tarjeta en tiempo real
            const formInputs = ['product-name', 'product-brand', 'product-category', 'product-price', 'product-description', 'product-image'];
            formInputs.forEach(inputId => {
                document.getElementById(inputId).addEventListener('input', updateCardPreview);
            });
            
            // Envío del formulario
            document.getElementById('perfume-form').addEventListener('submit', function(e) {
                e.preventDefault();
                savePerfume();
            });
            
            // Botón de actualizar
            document.getElementById('update-btn').addEventListener('click', function() {
                updatePerfume();
            });
            
            // Botón de eliminar
            document.getElementById('delete-btn').addEventListener('click', function() {
                if (confirm('¿Estás seguro de que deseas eliminar este perfume?')) {
                    deletePerfume(currentEditId);
                }
            });
            
            // Botón de cancelar
            document.getElementById('cancel-btn').addEventListener('click', function() {
                resetForm();
            });
            
            // Botón de limpiar formulario
            document.getElementById('clear-btn').addEventListener('click', function() {
                resetForm();
            });
        }
        
        // Actualizar vista previa de imagen
        function updateImagePreview() {
            const imageUrl = document.getElementById('product-image').value;
            const imagePreview = document.getElementById('image-preview');
            
            if (imageUrl && isValidUrl(imageUrl)) {
                imagePreview.innerHTML = `<img src="${imageUrl}" alt="Vista previa" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';">`;
            } else {
                // Mostrar imagen por defecto según la categoría seleccionada
                const category = document.getElementById('product-category').value;
                const defaultImage = defaultImages[category] || defaultImages.hombre;
                
                imagePreview.innerHTML = `
                    <div class="image-placeholder">
                        <i class="fas fa-image"></i>
                        <p>Vista previa de la imagen</p>
                        ${imageUrl && !isValidUrl(imageUrl) ? '<p style="color: #ff6b6b; font-size: 0.8rem; margin-top: 5px;">URL no válida</p>' : ''}
                    </div>
                `;
            }
        }
        
        // Actualizar vista previa de tarjeta
        function updateCardPreview() {
            const name = document.getElementById('product-name').value || 'Nombre del Perfume';
            const brand = document.getElementById('product-brand').value || 'Marca';
            const category = document.getElementById('product-category').value || 'hombre';
            const price = document.getElementById('product-price').value || '0.00';
            const description = document.getElementById('product-description').value || 'Descripción del perfume. Notas, características, etc.';
            const imageUrl = document.getElementById('product-image').value || defaultImages[category] || defaultImages.hombre;
            
            // Determinar clase de categoría
            let categoryClass = 'perfume-category category-hombre';
            let categoryText = 'Hombre';
            
            if (category === 'mujer') {
                categoryClass = 'perfume-category category-mujer';
                categoryText = 'Mujer';
            } else if (category === 'ninos') {
                categoryClass = 'perfume-category category-ninos';
                categoryText = 'Niños';
            }
            
            const cardPreview = document.getElementById('card-preview');
            cardPreview.innerHTML = `
                <div class="perfume-card">
                    <div class="perfume-image">
                        <img src="${imageUrl}" alt="${name}" onerror="this.onerror=null; this.src='${defaultImages[category] || defaultImages.hombre}';">
                        <span class="${categoryClass}">${categoryText}</span>
                    </div>
                    <div class="perfume-info">
                        <h3 class="perfume-name">${name}</h3>
                        <p class="perfume-brand">${brand}</p>
                        <p class="perfume-description">${description}</p>
                        <div class="perfume-footer">
                            <div class="perfume-price">$${parseFloat(price).toFixed(2)}</div>
                            <button class="add-to-cart">
                                <i class="fas fa-shopping-cart"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Guardar nuevo perfume
        function savePerfume() {
            const perfume = getFormData();
            
            // Validar formulario
            if (!validateForm(perfume)) return;
            
            // Asignar ID único
            perfume.id = 'perfume_' + Date.now();
            
            // Agregar a la lista
            perfumes.push(perfume);
            
            // Guardar en almacenamiento
            saveToStorage();
            
            // Recargar lista
            loadPerfumes();
            
            // Restablecer formulario
            resetForm();
            
            // Mostrar notificación
            showNotification('Perfume creado exitosamente', 'success');
        }
        
        // Editar perfume existente
        function editPerfume(id) {
            const perfume = perfumes.find(p => p.id === id);
            if (!perfume) return;
            
            // Establecer modo edición
            currentEditId = id;
            
            // Rellenar formulario con datos del perfume
            document.getElementById('product-id').value = perfume.id;
            document.getElementById('product-name').value = perfume.name;
            document.getElementById('product-brand').value = perfume.brand;
            document.getElementById('product-category').value = perfume.category;
            document.getElementById('product-price').value = perfume.price;
            document.getElementById('product-description').value = perfume.description;
            document.getElementById('product-image').value = perfume.image;
            
            // Cambiar título del formulario
            document.getElementById('form-title').textContent = 'Editar Perfume';
            
            // Mostrar botones de edición
            document.getElementById('submit-btn').style.display = 'none';
            document.getElementById('update-btn').style.display = 'flex';
            document.getElementById('delete-btn').style.display = 'flex';
            document.getElementById('cancel-btn').style.display = 'flex';
            
            // Actualizar vistas previas
            updateImagePreview();
            updateCardPreview();
            
            // Mostrar notificación
            showNotification('Modo edición activado', 'info');
        }
        
        // Actualizar perfume existente
        function updatePerfume() {
            const perfume = getFormData();
            perfume.id = currentEditId;
            
            // Validar formulario
            if (!validateForm(perfume)) return;
            
            // Encontrar índice del perfume
            const index = perfumes.findIndex(p => p.id === currentEditId);
            if (index === -1) return;
            
            // Actualizar perfume
            perfumes[index] = perfume;
            
            // Guardar en almacenamiento
            saveToStorage();
            
            // Recargar lista
            loadPerfumes();
            
            // Restablecer formulario
            resetForm();
            
            // Mostrar notificación
            showNotification('Perfume actualizado exitosamente', 'success');
        }
        
        // Eliminar perfume
        function deletePerfume(id) {
            // Si estamos en modo edición y se elimina el perfume actual
            if (currentEditId === id) {
                resetForm();
            }
            
            // Filtrar perfumes para eliminar el seleccionado
            perfumes = perfumes.filter(p => p.id !== id);
            
            // Guardar en almacenamiento
            saveToStorage();
            
            // Recargar lista
            loadPerfumes();
            
            // Mostrar notificación
            showNotification('Perfume eliminado exitosamente', 'success');
        }
        
        // Obtener datos del formulario
        function getFormData() {
            return {
                name: document.getElementById('product-name').value.trim(),
                brand: document.getElementById('product-brand').value.trim(),
                category: document.getElementById('product-category').value,
                price: document.getElementById('product-price').value,
                description: document.getElementById('product-description').value.trim(),
                image: document.getElementById('product-image').value.trim() || defaultImages[document.getElementById('product-category').value] || defaultImages.hombre
            };
        }
        
        // Validar formulario
        function validateForm(perfume) {
            if (!perfume.name) {
                showNotification('El nombre del perfume es requerido', 'error');
                return false;
            }
            
            if (!perfume.brand) {
                showNotification('La marca del perfume es requerida', 'error');
                return false;
            }
            
            if (!perfume.category) {
                showNotification('La categoría del perfume es requerida', 'error');
                return false;
            }
            
            if (!perfume.price || parseFloat(perfume.price) <= 0) {
                showNotification('El precio debe ser un número mayor a 0', 'error');
                return false;
            }
            
            if (!perfume.description) {
                showNotification('La descripción del perfume es requerida', 'error');
                return false;
            }
            
            return true;
        }
        
        // Restablecer formulario
        function resetForm() {
            document.getElementById('perfume-form').reset();
            document.getElementById('product-id').value = '';
            
            // Restablecer título del formulario
            document.getElementById('form-title').textContent = 'Crear Nuevo Perfume';
            
            // Restablecer botones
            document.getElementById('submit-btn').style.display = 'flex';
            document.getElementById('update-btn').style.display = 'none';
            document.getElementById('delete-btn').style.display = 'none';
            document.getElementById('cancel-btn').style.display = 'none';
            
            // Restablecer ID actual
            currentEditId = null;
            
            // Actualizar vistas previas
            updateImagePreview();
            updateCardPreview();
        }
        
        // Guardar en almacenamiento local
        function saveToStorage() {
            localStorage.setItem('perfumes', JSON.stringify(perfumes));
        }
        
        // Actualizar la sección de catálogo (simulación)
        function updateCatalogSection() {
            // En una implementación real, aquí actualizarías la sección anterior
            // Por ahora, solo mostraremos un mensaje en consola
            console.log('Catálogo actualizado con', perfumes.length, 'perfumes');
            
            // Podrías también enviar un evento personalizado para que la sección anterior se actualice
            window.dispatchEvent(new Event('perfumesUpdated'));
        }
        
        // Mostrar notificación
        function showNotification(message, type = 'success') {
            // Eliminar notificaciones anteriores
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => {
                notification.remove();
            });
            
            // Crear nueva notificación
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                ${message}
            `;
            
            document.body.appendChild(notification);
            
            // Mostrar notificación
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Ocultar y eliminar notificación después de 4 segundos
            setTimeout(() => {
                notification.style.transform = 'translateX(150%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }, 4000);
        }
        
        // Validar URL
        function isValidUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        }
        
        // Hacer las funciones disponibles globalmente para los botones onclick
        window.editPerfume = editPerfume;
        window.deletePerfume = deletePerfume;