<template>
<div class='tasksList'>
  <h2>List of Tasks goes here.</h2>

  <table class="table">
    <thead class="thead-dark">
      <tr>
        <th class="description">Description</th>
        <th class="edit">Edit</th>
        <th class="delete">Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="{ id, description, completed } in tasks" :key="id">
        <td class="description" v-bind:class="{ completed: completed }" @click='updateTaskCompletion(id)'>{{ description }}</td>
        <td>
          <router-link :to="'/editTask?taskID=' + id" class='btn btn-primary'>Edit</router-link>
        </td>
        <td><button class="btn btn-danger" @click='deleteTask(id)'>Delete</button></td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { db } from '../firebase'

export default {
  setup() {
    const tasksCollection = db.collection('tasks')
    const tasks = ref([]);

    const getTasks = tasksCollection.orderBy('creationTime', 'asc').onSnapshot(snapshot => {
      // console.log(snapshot.docs)

      tasks.value = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }))
    })
    onUnmounted(getTasks);

    const updateTaskCompletion = (taskID) => {
      tasksCollection.doc(taskID).get().then(doc => {
        if (doc.exists) {
          doc.ref.update({
            completed: !doc.data().completed,
          }).then(() => {
            console.log('Completion status of task has been successfully updated!')
          }).catch(error => {
            console.log('Error updating completion status: ', error)
          })
        } else {
          console.log('No such documen!')
        }
      }).catch(error => {
        console.log('Error getting document: ', error)
      })
    }

    const deleteTask = (taskID) => {
      tasksCollection.doc(taskID).get().then(doc => {
        if (doc.exists) {
          doc.ref.delete().then(() => {
            console.log('Document deleted successfully!')
          }).catch(error => {
            console.log('Deletion unsuccessful: ', error)
          }) 
        } else {
          console.log('No such document!')
        }
      }).catch(error => {
        console.log('Error getting document: ', error)
      })
    }

    return {
      tasks,
      updateTaskCompletion,
      deleteTask,
    }
  }
}
</script>

<style>
.tasksList table th.edit,
.tasksList table th.delete {
  width: 100px;
}
.tasksList tbody td.description {
  cursor: pointer;
}
.completed {
  text-decoration: line-through;
}
</style>