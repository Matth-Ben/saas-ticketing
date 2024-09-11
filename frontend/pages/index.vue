<template>
  <div class="p-8">
    <h1>Welcome to the Home Page</h1>
    <p>This is the content of the homepage.</p>
  </div>
  <form @submit.prevent="createProject">
    <input type="text" v-model="projectName" placeholder="Nom du projet" />
    <button type="submit">Ajouter le projet</button>
  </form>
  <h2>Projets :</h2>
  <ul>
    <li v-for="project in projects" :key="project.id">{{ project.name }}</li>
  </ul>
</template>

<script>
import { GraphQLClient, gql } from 'graphql-request';

export default {
  data() {
    return {
      projectName: '',
      projects: []
    };
  },
  async mounted() {
    // Initialiser le client GraphQL
    this.client = new GraphQLClient('http://localhost:4000/graphql');

    // Charger les projets existants
    await this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      const query = gql`
        query {
          projects {
            id
            name
          }
        }
      `;
      const data = await this.client.request(query);
      this.projects = data.projects;
    },
    async createProject() {
      const mutation = gql`
        mutation($name: String!) {
          createProject(name: $name) {
            id
            name
          }
        }
      `;
      const variables = { name: this.projectName };
      const data = await this.client.request(mutation, variables);
      this.projects.push(data.createProject);
      this.projectName = ''; // Réinitialiser le champ
    }
  }
};
</script>