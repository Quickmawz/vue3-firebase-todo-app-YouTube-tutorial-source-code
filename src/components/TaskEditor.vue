<template>
<div class='taskEditor'>
  <router-link :to="'/'" class='btn btn-primary'>Back</router-link>
  <h1>Task Editor</h1>
  <form @submit.prevent='updateTask'>
    <div class="form-group">
      <label for="taskDescription">Task Description</label>
      <input type="text" id='taskDescription' class='form-control' placeholder='Add new task description here' v-model='taskDescription' required>
    </div>
    <div class="form-group form-check">
      <input type="checkbox" v-model='taskCompleted' id='taskCompletionStatus' class='form-check-input' />
      <label for="taskCompletionStatus" class='form-check-label'>Completed</label>
    </div>
    <div class="form-group">
      <label for="">Task Creation Date: {{ taskCreationDateAndTimeOfDay }}</label>
    </div>
    <button type='submit' class='btn btn-success'>Update</button>
  </form>
</div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase'
import router from '../router'

export default {
  setup() {
    const tasksCollection = db.collection('tasks')
    const route = useRoute()
    const taskID = route.query.taskID
    const taskDescription = ref('')
    const taskCompleted = ref(null)
    const taskCreationDateAndTimeOfDay = ref(0)

    // console.log(taskID)

    const getTask = tasksCollection.doc(taskID).get().then(doc => {
      if (doc.exists) {
        // console.log(doc.data())

        taskDescription.value = doc.data().description
        taskCompleted.value = doc.data().completed
        taskCreationDateAndTimeOfDay.value = new Date(doc.data().creationTime).toLocaleTimeString('en-US', {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
        })
      } else {
        console.log('No such document found!')
      }
    }).catch(error => {
      console.log('Error getting document: ', error)
    })

    onUnmounted(getTask)

    const updateTask = () => {
      tasksCollection.doc(taskID).get().then(doc => {
        if (doc.exists) {
          doc.ref.update({
            description: taskDescription.value,
            completed: taskCompleted.value
          }).then(() => {
            console.log('Task successfully updated!')
            router.push('/')
          }).catch(error => {
            console.log('Error updating task: ', error)
          })
        } else {
          console.log('No such document!')
        }
      })
    }

    return {
      taskDescription,
      taskCompleted,
      taskCreationDateAndTimeOfDay,
      updateTask,
    }
  }
}
</script>

<style>

</style>