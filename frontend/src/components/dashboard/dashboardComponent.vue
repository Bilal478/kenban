<!-- Dashboard.vue -->

<template>
  <div class="dashboard">
    <h2>Welcome to the Dashboard!</h2>
    <button @click="logout">Logout</button>
    <div class="mr-10"><label for="cars">Status </label>

      <select name="status" id="status" v-model="selectedStatus" @change="fetchColumns">
        <option>Select Status</option>
        <option value="1">Active</option>
        <option value="0">Deleted</option>
        <option value="all">All</option>
      </select>
    </div>
    <div class="mr-10">
      <label for="datepicker">Select Date:</label>
      <input type="date" v-model="selectedDate" @change="fetchColumns" id="datepicker">
    </div>

    <!-- Lists container -->
    <section class="lists-container">
      <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="list">
        <h3 class="list-title">
          {{ column.title }}
          <button @click="deleteColumn(columnIndex)" class="column__delete-button">X</button>
        </h3>
        <ul class="list-items box-shadow">
          <draggable group="people" :list="column.cards" @change="onEnd(column.id, $event)">
            <li v-for="(card, cardIndex) in column.cards" :key="cardIndex" :data-index="cardIndex">
              <span @click="card.deleted_at ? null : openEditCardModal(columnIndex, cardIndex)">{{ card.title }}</span>

              <button @click="deleteCard(columnIndex, cardIndex)" class="column__card-delete-button"> <span
                  v-if="card.deleted_at">Trashed</span>&nbsp;X</button>
            </li>
          </draggable>
        </ul>
        <button @click="openAddCardModal(columnIndex)" class="add-card-btn btn column__button">Add Card</button>
      </div>

      <!-- Modals -->
      <modal name="editCardModal">
        <h2>Edit Card</h2>
        <div class="mr-10">
          <label>Card Title:</label>
          <input v-model="editedCardTitle" type="text" required>
        </div>
        <div class="mr-10">
          <label>Card Description:</label>
          <textarea v-model="editedCardDescription" required></textarea>
        </div>

        <button @click="editCard" class="edit-card-btn btn column__button mr-10">Save Changes</button>
        <button @click="closeEditCardModal" class="column__button">Close</button>
      </modal>

      <modal name="addCardModal">
        <h2>Add New Card</h2>
        <div class="mr-10">
          <label>Card Title:</label>
          <input v-model="newCardTitle" type="text" required>
        </div>
        <div class="mr-10">
          <label>Card Description:</label>
          <textarea v-model="newCardDescription" required></textarea>
        </div>

        <button @click="addCard(currentColumnIndex)" class="add-card-btn btn column__button mr-10">Add Card</button>
        <button @click="closeAddCardModal" class="column__button">Close</button>
      </modal>

      <modal name="addColumnModal">
        <h2>Add New Column</h2>
        <div class="mr-10">
          <label>Column Title:</label>
          <input v-model="newColumnTitle" type="text" required>
        </div>
        <button @click="addColumn" class="btn column__button mr-10">Add Column</button>
        <button @click="closeAddColumnModal" class="column__button">Close</button>
      </modal>

      <span><button @click="openAddColumnModal" class="add-card-btn btn column__button">Add Column</button></span>
    </section>

    <span><button @click="exportDatabase" class="add-card-btn btn column__button">Export Database</button></span>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ApiService from '@/services/ApiService';

const MODAL_EDIT_CARD = 'editCardModal';
const MODAL_ADD_CARD = 'addCardModal';
const MODAL_ADD_COLUMN = 'addColumnModal';

export default {
  data() {
    return {
      columns: [],
      newColumnTitle: '',
      newCardTitle: '',
      newCardDescription: '',
      editedCardIndex: null,
      editedCardTitle: '',
      editedCardDescription: '',
      currentColumnIndex: null,
      newColumId: '',
      oldColumnId: '',
      CardId: '',
      oldIndex: '',
      newIndex: '',
      selectedStatus: 1,
      selectedDate: '',
    };
  },
  components: {
    draggable
  },
  methods: {
    openEditCardModal(columnIndex, cardIndex) {
      this.currentColumnIndex = columnIndex;
      this.editedCardIndex = cardIndex;
      this.editedCardTitle = this.columns[columnIndex].cards[cardIndex].title;
      this.editedCardDescription = this.columns[columnIndex].cards[cardIndex].description;
      this.$modal.show(MODAL_EDIT_CARD);
    },

    closeEditCardModal() {
      this.$modal.hide(MODAL_EDIT_CARD);
      this.editedCardIndex = null;
      this.editedCardTitle = '';
      this.editedCardDescription = '';
      this.currentColumnIndex = null;
    },

    openAddCardModal(columnIndex) {
      this.currentColumnIndex = columnIndex;
      this.$modal.show(MODAL_ADD_CARD);
    },

    closeAddCardModal() {
      this.$modal.hide(MODAL_ADD_CARD);
      this.newCardTitle = '';
      this.newCardDescription = '';
      this.currentColumnIndex = null;
    },

    openAddColumnModal() {
      this.$modal.show(MODAL_ADD_COLUMN);
    },

    closeAddColumnModal() {
      this.newColumnTitle = '';
      this.$modal.hide(MODAL_ADD_COLUMN);
    },

    async fetchColumns() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.get(`columns/${this.selectedStatus}/${this.selectedDate}`, token);
        this.columns = response.data;
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    },

    async addColumn() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.post('columns', { title: this.newColumnTitle }, token);
        this.columns.push(response.data);
        this.newColumnTitle = '';
        this.fetchColumns();
        this.$modal.hide(MODAL_ADD_COLUMN);
      } catch (error) {
        console.error('Error adding column:', error);
      }
    },

    async addCard(columnIndex) {
      const token = localStorage.getItem('token');
      const columnId = this.columns[columnIndex].id;
      try {
        const response = await ApiService.post('cards', {
          title: this.newCardTitle,
          description: this.newCardDescription,
          column_id: columnId,
        }, token);
        // if (!this.columns[columnIndex].cards) {
        //    this.$set(this.columns, columnIndex, { cards: [] });
        //   }

        this.columns[columnIndex].cards.push(response.data);

        this.newCardTitle = '';
        this.$modal.hide(MODAL_ADD_CARD);
      } catch (error) {
        console.error('Error adding card:', error);
      }
    },

    async deleteCard(columnIndex, cardIndex) {
      const token = localStorage.getItem('token');
      const cardId = this.columns[columnIndex].cards[cardIndex].id;
      try {
        await ApiService.delete(`cards/${cardId}`, token);
        this.columns[columnIndex].cards.splice(cardIndex, 1);
      } catch (error) {
        console.error('Error deleting card:', error);
      }
    },

    async editCard() {
      try {
        const token = localStorage.getItem('token');
        const cardId = this.columns[this.currentColumnIndex].cards[this.editedCardIndex].id;
        await ApiService.put(`cards/${cardId}`, {
          title: this.editedCardTitle,
          description: this.editedCardDescription,
        }, token);
        this.columns[this.currentColumnIndex].cards[this.editedCardIndex].title = this.editedCardTitle;
        this.columns[this.currentColumnIndex].cards[this.editedCardIndex].description = this.editedCardDescription;
        this.closeEditCardModal();
      } catch (error) {
        console.error('Error editing card:', error);
      }
    },

    async deleteColumn(columnIndex) {
      const token = localStorage.getItem('token');
      const columnId = this.columns[columnIndex].id;
      try {
        await ApiService.delete(`columns/${columnId}`, token);
        this.columns.splice(columnIndex, 1);
      } catch (error) {
        console.error('Error deleting column:', error);
      }
    },


    // start(evt){
    //   // console.log('I at start method',evt)
    // },
    // end(evt){
    //   // console.log('i at end method',evt)
    // },
    onEnd(columnId, evt) {
      console.log('onEnd', columnId, evt);
      if (evt.moved) {
        const moveData = {
          columnId: evt.moved.element.column_id,
          carId: evt.moved.element.id,
          newIndex: evt.moved.newIndex,
          oldIndex: evt.moved.oldIndex,
          column: 'same',
        };
        this.updateCardOrder(moveData);
        console.log('yes i am in moved');
      }

      if (evt.added) {
        this.newColumId = columnId;
        this.cardId = evt.added.element.id;
        this.newIndex = evt.added.newIndex;
        console.log('yes i am in added');
      }
      if (evt.removed) {
        this.oldColumnId = columnId;
        this.oldIndex = evt.removed.oldIndex;
        const moveData = {
          new_column_id: this.newColumId,
          old_column_id: this.oldColumnId,
          new_index: this.newIndex,
          old_index: this.oldIndex,
          card_id: this.cardId,
          column: 'different',
          // Additional data as needed
        };
        this.updateCardOrder(moveData);
        console.log('yes i am in removed');
      }
      // console.log('aa bb');


      // this.updateCardOrder(moveData);
    },
    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found.');
          return;
        }
        await ApiService.post('logout', null, token);
        localStorage.removeItem('token');
        this.$router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
    async moveCardToOtherColumn(moveData) {
      console.log('moveeeeeeeee: ', moveData)
      try {
        const token = localStorage.getItem('token');
        //  console.log('move-card-to-other-column: ', moveData, token)
        const response = await ApiService.put('move-card-to-other-column', moveData, token);
        console.log(response)

        // Fetch the updated data from the server
        // this.fetchColumns();
      } catch (error) {
        console.error('Error updating card order:', error);
      }
    },
    async updateCardOrder(moveData) {

      try {
        const token = localStorage.getItem('token');
        console.log('moveData: ', moveData, token)
        const response = await ApiService.put('move-card', moveData, token);
        console.log(response)

        // Fetch the updated data from the server
        // this.fetchColumns();
      } catch (error) {
        console.error('Error updating card order:', error);
      }
    },

    async exportDatabase() {
      try {
        const token = localStorage.getItem('token');
        const response = await ApiService.getDatabaseFile('export-database', token);
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: 'application/sql' });

        // Create a link element and trigger a click to download the file
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'database_backup.sql';
        link.click();

        // Clean up
        window.URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error('Error fetching columns:', error);
      }
    },
  },
  mounted() {
    this.fetchColumns();
  },
};
</script>

<style lang="scss" scoped>
@import './DashboardComponent.scss';
</style>
