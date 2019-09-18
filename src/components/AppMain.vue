<template>
  <div class="app-main">
    <v-layout column fill-height>
      <div>header</div>

      <v-flex shrink class="content">
        <!-- eslint-disable -->
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquet rutrum magna, eu pulvinar turpis commodo vitae. Curabitur pharetra justo venenatis velit commodo commodo. Integer id ex mollis, porttitor erat quis, vestibulum nunc. Nam tortor metus, egestas blandit venenatis et, varius sed metus. Sed vel lacus in purus efficitur dapibus et a leo. Sed bibendum urna magna, id vestibulum erat vehicula in. Donec in vulputate sem, a scelerisque justo. Aenean suscipit lacus a ante ultricies, non sagittis est consequat. Morbi consequat, neque at porttitor lacinia, augue lectus feugiat mauris, dapibus eleifend sapien neque eget neque. Sed egestas magna eu ante ornare, nec feugiat nisi sagittis.
        </p>

        <p>
          Etiam volutpat dolor non elementum efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque suscipit mi vel ligula facilisis, vel ornare urna vulputate. Sed magna neque, gravida nec nunc eget, vulputate porta nulla. Sed et viverra mauris, eget interdum purus. Nullam sagittis vel sem non pharetra. Aliquam in auctor nibh. Nunc arcu odio, fringilla non aliquet non, pulvinar eget ante. Quisque imperdiet id nunc eget sagittis. Aliquam pretium risus a nibh pellentesque, quis imperdiet justo congue. Proin aliquam tortor ut magna maximus, ut pretium lacus rhoncus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc eros sem, aliquet eget quam in, luctus vestibulum nisl. Vestibulum cursus lacus eget fringilla accumsan. Integer a vestibulum ipsum.
        </p>

        <p>
          Integer efficitur ipsum vitae neque imperdiet gravida. Nunc dapibus rhoncus lectus. Praesent eleifend aliquet elit, vitae convallis orci vestibulum sit amet. Curabitur tempor, urna sit amet faucibus interdum, nisi mi volutpat nisi, et sollicitudin libero lacus eu diam. Praesent bibendum ultrices mi, vel aliquam arcu congue ac. Proin vestibulum faucibus placerat. Nulla eu facilisis lorem.
        </p>

        <p>
          Mauris dictum ipsum finibus, bibendum erat molestie, vulputate massa. Praesent sed elit tincidunt lectus commodo dapibus. Pellentesque malesuada ex at augue tristique porta. Nam eleifend vitae arcu eget luctus. Vestibulum mollis lectus non justo condimentum, at posuere lorem finibus. Pellentesque lacinia felis non placerat dignissim. Sed sit amet ultricies risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam sollicitudin,
          mi sit amet bibendum gravida, eros magna euismod turpis, non eleifend dolor mauris a lacus.
        </p>

        <p>
          Nam eget nisi urna. In vehicula justo dolor, suscipit commodo odio auctor in. Cras sit amet libero sed enim varius fermentum. Vivamus sodales justo justo, nec congue dolor pellentesque non. Integer quam nisi, imperdiet non euismod sit amet, blandit ut mauris. Donec sit amet lectus ac quam egestas sagittis. Aenean gravida vehicula porttitor. Praesent commodo bibendum nisl, eget semper odio facilisis nec. Nullam tincidunt venenatis erat, in vulputate elit sodales et. Praesent quam nunc, faucibus at feugiat quis, faucibus non quam. Donec quis orci non metus finibus ullamcorper et in ex. Nunc sed commodo ipsum. Sed a tristique lectus. In pellentesque tristique interdum.
        </p>

        <div>
        <pre>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec odio sed orci tempus fermentum. Mauris ut eros viverra, convallis sapien quis, ornare ligula. Nullam maximus, elit maximus congue blandit, eros mauris condimentum tellus, at luctus enim sapien vitae ligula.
        </pre>
        </div>
        <!-- eslint-enable -->
      </v-flex>

      <div>footer</div>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
};
</script>

<style scoped>
  .app-main {
    height: 100%;
  }

  pre {
    overflow: auto;
  }

  .content {
    min-height: 0;
    overflow-y: auto;
  }
</style>
