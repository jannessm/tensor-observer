from urllib.request import Request, urlopen
import json

API = 'http://localhost:8080'

def post(data):
    try:
        request = Request(
            API,
            data=json.dumps(data).encode('utf8'),
            headers={'content-type': 'application/json'}
        )
        urlopen(request)
    except Exception as e:
        pass


def post_scalar(scalar, run, tag, step, wall_time):
    data = {
        'type': 'scalar',
        'scalar': scalar,
        'run': run,
        'tag': tag,
        'step': step,
        'wall_time': wall_time
    }

    post(data)
        

def post_exception(e, run, wall_time):
    data = {
        'type': 'exception',
        'exception': str(e),
        'run': run,
        'wall_time': wall_time
    }

    post(data)

if __name__ == '__main__':
    from time import time, sleep
    from random import random, randint

    runs = ['a_cool_net', 'another_one', 'some_exp', 'nice']
    tags = ['accuracy', 'loss']
    exceptions = ['broke', 'smth went wrong', 'cool error dude!']

    for i in range(100):
        if random() < 0.5:
            post_scalar(
                random(),
                runs[randint(0,3)],
                tags[randint(0,1)],
                i,
                time()
            )
        else:
            post_exception(
                Exception(exceptions[randint(0,2)]),
                runs[randint(0,3)],
                time()
            )
        sleep(1)
    
    post_exception(
        Exception(exceptions[randint(0,2)]),
        runs[randint(0,3)],
        time()
    )