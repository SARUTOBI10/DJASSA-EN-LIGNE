// Test script pour vérifier le système de notifications
console.log('=== TEST DU SYSTÈME DE NOTIFICATIONS ===');

// Test 1: Ajouter une notification pour un email
console.log('Test 1: Ajout de notification');
addNotificationToClient('test@example.com', 'Votre commande a été confirmée');
addNotificationToClient('guest@test.com', 'Votre commande est en cours de préparation');

// Test 2: Récupérer les notifications
console.log('Test 2: Récupération des notifications');
const notifs1 = getNotificationsForEmail('test@example.com');
const notifs2 = getNotificationsForEmail('guest@test.com');
console.log('Notifications pour test@example.com:', notifs1);
console.log('Notifications pour guest@test.com:', notifs2);

// Test 3: Marquer comme lu
console.log('Test 3: Marquer comme lu');
if (notifs1.length > 0) {
    markNotificationAsRead('test@example.com', notifs1[0].id);
    console.log('Notification marquée comme lue');
}

// Test 4: Vérifier après marquage
console.log('Test 4: Vérification après marquage');
const notifs1Updated = getNotificationsForEmail('test@example.com');
console.log('Notifications mises à jour:', notifs1Updated);

console.log('=== FIN DU TEST ===');